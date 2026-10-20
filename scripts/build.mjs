// Static site generator for torinhopkins.com.
// Reads content/*.js, renders HTML pages into dist/, and copies src/assets.
//
//   SITE_URL   absolute site URL used for canonical/OG/sitemap (default: content/site.js url)
//   BASE_PATH  path prefix when served from a sub-path, e.g. /website on github.io (default: '')

import { mkdir, rm, writeFile, readFile, cp, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';
import sharp from 'sharp';

import site from '../content/site.js';
import publications from '../content/publications.js';
import { projects, performances, tags } from '../content/projects.js';
import details from '../content/project-details.js';
import resources from '../content/resources.js';
import * as cv from '../content/cv.js';
import { brand } from './icons.mjs';

const OUT = 'dist';
// Always canonicalize to https (GitHub reports http:// until a custom domain's certificate is issued)
const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, '').replace(/^http:\/\//, 'https://');
const BASE = (process.env.BASE_PATH || '').replace(/\/$/, '');
const BUILD_DATE = new Date().toISOString().slice(0, 10);
const YEAR = new Date().getFullYear();

// ------------------------------------------------------------------ helpers

const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const u = (p) => BASE + p;
const abs = (p) => SITE_URL + p;
const pubById = Object.fromEntries(publications.map((p) => [p.id, p]));
const hasPage = (p) => Boolean(p.abstract);
const pubPath = (p) => `/publications/${p.id}/`;
const projectPath = (pr) => `/research/${pr.slug}/`;
const projectBySlug = Object.fromEntries(projects.map((pr) => [pr.slug, pr]));
const isMe = (name) => /Hopkins$/.test(name);

// All publications for a project: the card's `pub` plus any listed in project-details.js
const projectPubs = (pr) => [...new Set([pr.pub, ...(details[pr.slug]?.pubs || [])].filter(Boolean))].map((id) => {
  if (!pubById[id]) throw new Error(`Unknown publication id "${id}" in project "${pr.slug}"`);
  return pubById[id];
});
// Reverse lookup: publication id → projects that cite it (for "Project page" links on paper pages)
const projectsByPub = {};
for (const pr of projects) for (const p of projectPubs(pr)) (projectsByPub[p.id] ||= []).push(pr);

const ui = {
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
  external: '<path d="M15 3h6v6M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
  arrow: '<path d="M5 12h14M12 5l7 7-7 7"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9z"/>',
  code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
  copy: '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
};
const icon = (name) =>
  brand[name]
    ? `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor"><path d="${brand[name]}"/></svg>`
    : `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ui[name]}</svg>`;

// Image dimensions, so the browser can reserve space (no layout shift).
const imgDims = {};
for (const f of await readdir('src/assets/img', { recursive: true })) {
  if (!/\.(webp|jpe?g|png)$/i.test(f)) continue;
  const m = await sharp(path.join('src/assets/img', f)).metadata();
  imgDims[f.split(path.sep).join('/')] = [m.width, m.height];
}
const img = (file, alt, { cls = '', eager = false, sizes = '' } = {}) => {
  const [w, h] = imgDims[file] || [];
  return `<img src="${u('/assets/img/' + file)}" alt="${esc(alt)}"${w ? ` width="${w}" height="${h}"` : ''}${cls ? ` class="${cls}"` : ''} ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"${sizes ? ` sizes="${sizes}"` : ''}>`;
};

// Cache-busting hash for CSS/JS
const fileHash = async (p) => createHash('sha1').update(await readFile(p)).digest('hex').slice(0, 8);
const cssV = await fileHash('src/assets/css/site.css');
const jsV = await fileHash('src/assets/js/site.js');

// ------------------------------------------------------------------ publication formatting

function authorsHtml(authors) {
  const names = authors.map((a) => (a === 'et al.' ? 'et al.' : isMe(a) ? `<strong>${esc(a)}</strong>` : esc(a)));
  if (names.at(-1) === 'et al.') return names.slice(0, -1).join(', ') + ', et al.';
  if (names.length <= 2) return names.join(' and ');
  return names.slice(0, -1).join(', ') + ', and ' + names.at(-1);
}

// "pp. 9–16" for proceedings; "7(9):e0222064" style for journals with article numbers
const locator = (p) =>
  p.type === 'journal' && p.volume
    ? `${p.volume}${p.issue ? `(${p.issue})` : ''}${p.pages ? `:${p.pages}` : ''}`
    : p.pages ? `pp. ${p.pages}` : '';

const STATUS = { accepted: 'Accepted', 'under-review': 'Under review', 'in-preparation': 'In preparation' };
const TYPE = {
  journal: 'Journal', conference: 'Conference', workshop: 'Workshop', poster: 'Poster / Abstract',
  chapter: 'Book Chapter', thesis: 'Dissertation',
};

function pubLinks(p, { includePage = true } = {}) {
  const links = [];
  if (includePage && hasPage(p)) links.push({ label: 'Abstract', href: u(pubPath(p)), icon: 'arrow' });
  if (p.pdf) links.push({ label: 'PDF', href: u('/assets/papers/' + p.pdf), icon: 'file' });
  if (p.doi) links.push({ label: 'DOI', href: `https://doi.org/${p.doi}`, icon: 'external', ext: true });
  if (p.url) links.push({ label: p.urlLabel || 'Link', href: p.url, icon: p.urlLabel === 'Code' ? 'code' : 'external', ext: true });
  return links;
}
const linkChips = (links) =>
  links.length
    ? `<div class="chips">${links
        .map((l) => `<a class="chip" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${icon(l.icon)}${esc(l.label)}</a>`)
        .join('')}</div>`
    : '';

function pubItem(p) {
  const status = p.status && p.status !== 'published' ? `<span class="badge badge-status">${STATUS[p.status]}</span>` : '';
  const note = p.note ? `<span class="badge">${esc(p.note)}</span>` : '';
  const oa = p.openAccess ? '<span class="badge badge-oa">Open access</span>' : '';
  const title = hasPage(p) ? `<a href="${u(pubPath(p))}">${esc(p.title)}</a>` : esc(p.title);
  const venue = [p.venue, p.location, locator(p)].filter(Boolean).map(esc).join(', ');
  const search = [p.title, p.authors.join(' '), p.venue, p.venueShort, p.year, (p.keywords || []).join(' ')].join(' ').toLowerCase();
  return `<li class="pub" data-tags="${p.type}${p.status ? ' ' + p.status : ''}" data-search="${esc(search)}">
  <p class="pub-title">${title}</p>
  <p class="pub-authors">${authorsHtml(p.authors)}</p>
  <p class="pub-venue">${venue ? `<em>${venue}</em>, ` : ''}${p.year}. ${status}${note}${oa}</p>
  ${linkChips(pubLinks(p))}
</li>`;
}

function bibtex(p) {
  const last = (n) => n.split(' ').at(-1);
  const first = (n) => n.split(' ').slice(0, -1).join(' ');
  const key = `${last(p.authors[0]).toLowerCase().replace(/[^a-z]/g, '')}${p.year}${p.title.split(/[^A-Za-z]+/).find((w) => w.length > 3)?.toLowerCase() || ''}`;
  const authors = p.authors.map((a) => (a === 'et al.' ? 'others' : `${last(a)}, ${first(a)}`)).join(' and ');
  const kind = { journal: 'article', chapter: 'incollection', thesis: 'phdthesis' }[p.type] || 'inproceedings';
  const fields = [['title', `{${p.title}}`], ['author', authors]];
  if (kind === 'article') fields.push(['journal', p.venue]);
  else if (kind === 'phdthesis') fields.push(['school', 'University of Colorado Boulder']);
  else fields.push(['booktitle', p.venue]);
  if (p.volume) fields.push(['volume', p.volume]);
  if (p.issue) fields.push(['number', p.issue]);
  if (p.pages) fields.push(['pages', p.pages.replace('–', '--')]);
  fields.push(['year', String(p.year)]);
  if (p.doi) fields.push(['doi', p.doi]);
  return `@${kind}{${key},\n${fields.map(([k, v]) => `  ${k} = {${v}}`).join(',\n')}\n}`;
}

// ------------------------------------------------------------------ layout

const NAV = [
  ['Research', '/research/'],
  ['Publications', '/publications/'],
  ['Performances', '/performances/'],
  ['CV', '/cv/'],
  ['AI Music Resources', '/ai-music-resources/'],
  ['Contact', '/#contact'],
];

// Email is never written to the HTML in plain text, to keep it away from scrapers.
// It ships reversed and base64-encoded; site.js decodes it in the browser.
const emailEnc = Buffer.from([...site.email].reverse().join('')).toString('base64');
const emailFallback = esc(site.email.replace('@', ' [at] ').replace(/\./g, ' [dot] '));
const emailLink = (inner, attrs = '') => `<a href="${u('/#contact')}" data-em="${emailEnc}"${attrs}>${inner}</a>`;
const emailText = `<span data-em-text>${emailFallback}</span>`;

const socialLinks = (cls = 'social') =>
  `<ul class="${cls}">${site.social
    .map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="me noopener" aria-label="${esc(s.label)}" title="${esc(s.label)}">${icon(s.id)}</a></li>`)
    .join('')}<li>${emailLink(icon('mail'), ' aria-label="Email" title="Email"')}</li></ul>`;

const personLd = {
  '@type': 'Person',
  '@id': abs('/#person'),
  name: site.name,
  givenName: site.name.split(' ')[0],
  familyName: site.name.split(' ').at(-1),
  alternateName: site.alternateNames,
  honorificSuffix: 'PhD',
  url: abs('/'),
  image: abs(site.photo),
  jobTitle: 'Researcher in Music, Computing, and Neuroscience',
  description: site.description,
  affiliation: site.affiliations.map((a) => ({ '@type': 'CollegeOrUniversity', name: a.name, url: a.url })),
  worksFor: site.affiliations.map((a) => ({ '@type': 'CollegeOrUniversity', name: a.name, url: a.url })),
  alumniOf: [
    { '@type': 'CollegeOrUniversity', name: 'University of Colorado Boulder' },
    { '@type': 'CollegeOrUniversity', name: 'Iowa State University' },
    { '@type': 'CollegeOrUniversity', name: 'Southern Illinois University' },
  ],
  knowsAbout: site.interests,
  sameAs: site.social.map((s) => s.url),
};

function breadcrumbLd(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [['Home', '/'], ...trail].map(([name, p], i) => ({
      '@type': 'ListItem', position: i + 1, name, item: abs(p),
    })),
  };
}

function layout({ title, description, path: p, body, jsonld = [], head = '', ogType = 'website', image = site.ogImage }) {
  const fullTitle = title ? `${title} | ${site.honorific}` : site.title;
  const canonical = abs(p);
  const ld = { '@context': 'https://schema.org', '@graph': jsonld };
  const current = (href) => (href !== '/#contact' && p.startsWith(href) ? ' aria-current="page"' : '');
  return `<!doctype html>
<html lang="${site.lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
<meta name="author" content="${esc(site.name)}">
<meta name="keywords" content="${esc(site.keywords.join(', '))}">
<link rel="canonical" href="${canonical}">
<meta name="robots" content="index, follow, max-image-preview:large">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="${esc(site.honorific)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${canonical}">
<meta property="og:image" content="${abs(image)}">
<meta property="og:image:alt" content="${esc(title || site.honorific)}">
<meta property="og:locale" content="${site.locale}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@TorinHopkins">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${abs(image)}">
${site.googleSiteVerification ? `<meta name="google-site-verification" content="${esc(site.googleSiteVerification)}">\n` : ''}${site.bingSiteVerification ? `<meta name="msvalidate.01" content="${esc(site.bingSiteVerification)}">\n` : ''}${site.social.map((s) => `<link rel="me" href="${esc(s.url)}">`).join('\n')}
${head}
<meta name="theme-color" content="#681a1a">
<link rel="icon" href="${u('/favicon.svg')}" type="image/svg+xml">
<link rel="icon" href="${u('/favicon-32.png')}" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${u('/apple-touch-icon.png')}">
<link rel="manifest" href="${u('/site.webmanifest')}">
<link rel="sitemap" type="application/xml" href="${u('/sitemap.xml')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,600;0,700;1,400&family=Oxygen:wght@400;700&display=swap">
<link rel="stylesheet" href="${u('/assets/css/site.css')}?v=${cssV}">
<script>try{var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t}catch(e){}</script>
<script type="application/ld+json">${JSON.stringify(ld)}</script>
${analytics}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="${u('/')}">${esc(site.name)}<span>, PhD</span></a>
    <button class="icon-btn nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Menu">${icon('menu')}</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${NAV.map(([label, href]) => `<li><a href="${u(href)}"${current(href)}>${label}</a></li>`).join('')}</ul>
      <button class="icon-btn theme-toggle" aria-label="Toggle dark mode" title="Toggle dark mode">${icon('moon')}${icon('sun')}</button>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-inner">
    <div>
      <p class="footer-name">${esc(site.honorific)}</p>
      <p>${esc(site.tagline)}</p>
    </div>
    ${socialLinks()}
  </div>
  <div class="wrap footer-meta"><p>© ${YEAR} ${esc(site.name)} · <a href="${u(site.cvPdf)}">CV (PDF)</a> · <a href="${u('/sitemap.xml')}">Sitemap</a></p></div>
</footer>
<script src="${u('/assets/js/site.js')}?v=${jsV}" defer></script>
</body>
</html>
`;
}

// Google Analytics 4 — skipped when previewing locally so test visits aren't counted
const analytics = site.googleAnalytics
  ? `<script>if(!/^(localhost|127\\.0\\.0\\.1)$/.test(location.hostname)){var s=document.createElement('script');s.async=1;s.src='https://www.googletagmanager.com/gtag/js?id=${site.googleAnalytics}';document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};gtag('js',new Date());gtag('config','${site.googleAnalytics}')}</script>`
  : '';

const pageHeader = (title, lede = '', eyebrow = '') =>
  `<header class="page-header"><div class="wrap">${eyebrow ? `<p class="eyebrow">${eyebrow}</p>` : ''}<h1>${title}</h1>${lede ? `<p class="lede">${lede}</p>` : ''}</div></header>`;

// ------------------------------------------------------------------ cards

function projectCard(pr) {
  const p = pr.pub ? pubById[pr.pub] : null;
  if (pr.pub && !p) throw new Error(`Unknown publication id "${pr.pub}" in project "${pr.title}"`);
  const links = [...(p ? pubLinks(p) : []), ...(pr.links || []).map((l) => ({ ...l, href: l.url, icon: l.label === 'Code' ? 'code' : 'external', ext: true }))];
  const meta = p
    ? [
        p.venueShort || p.venue,
        p.status && p.status !== 'published' ? STATUS[p.status] : p.venueShort?.match(/\d{4}/) ? '' : p.year,
      ].filter(Boolean).map(esc).join(' · ')
    : '';
  const media = pr.image
    ? img(pr.image, pr.title, { sizes: '(max-width: 700px) 100vw, 360px' })
    : `<div class="card-placeholder" aria-hidden="true"><span>${esc(pr.title.split(' ').slice(0, 2).map((w) => w[0]).join(''))}</span></div>`;
  const href = u(projectPath(pr));
  // The whole image and title open the project page; chips keep direct paper/PDF access
  return `<article class="card" data-tags="${(pr.tags || []).join(' ')}">
  <a class="card-media" href="${href}" tabindex="-1" aria-hidden="true">${media}</a>
  <div class="card-body">
    ${meta ? `<p class="card-meta">${meta}</p>` : ''}
    <h3><a href="${href}">${esc(pr.title)}</a></h3>
    <p>${esc(pr.description)}</p>
    ${linkChips([{ label: 'Project', href, icon: 'arrow' }, ...links.filter((l) => l.label !== 'Abstract')])}
  </div>
</article>`;
}

const videoLink = (url) => ({ label: 'Watch video', href: url, icon: 'play', ext: true });

function performanceCard(pf) {
  const p = pf.pub ? pubById[pf.pub] : null;
  const href = pf.slug ? u(projectPath(projectBySlug[pf.slug])) : null;
  const links = [
    ...(href ? [{ label: 'Project', href, icon: 'arrow' }] : []),
    ...(pf.video ? [videoLink(pf.video)] : []),
    ...(p ? pubLinks(p).filter((l) => l.label !== 'Abstract') : []),
  ];
  return `<article class="card card-wide">
  ${pf.image ? `<div class="card-media">${img(pf.image, pf.title, { sizes: '(max-width: 700px) 100vw, 480px' })}</div>` : ''}
  <div class="card-body">
    <p class="card-meta">${pf.year} · ${esc(pf.venue)}</p>
    <h3>${href ? `<a href="${href}">${esc(pf.title)}</a>` : esc(pf.title)}</h3>
    <p>${esc(pf.description)}</p>
    ${linkChips(links)}
  </div>
</article>`;
}

// ------------------------------------------------------------------ project pages

function videoEmbed(v) {
  if (v.youtube) {
    // Lightweight embed: a thumbnail that swaps in the (privacy-enhanced) player on click
    return `<figure class="video">
  <a class="video-lite" href="https://www.youtube.com/watch?v=${v.youtube}" data-youtube="${v.youtube}" target="_blank" rel="noopener" aria-label="Play: ${esc(v.title)}">
    <img src="https://i.ytimg.com/vi/${v.youtube}/hqdefault.jpg" alt="" width="480" height="360" loading="lazy" decoding="async">
    <span class="video-play">${icon('play')}</span>
  </a>
  <figcaption>${esc(v.title)}</figcaption>
</figure>`;
  }
  if (v.vimeo) return `<p><a class="btn" href="https://vimeo.com/${v.vimeo}" target="_blank" rel="noopener">${icon('play')}${esc(v.title)}</a></p>`;
  return '';
}

function projectPage(pr) {
  const d = details[pr.slug] || {};
  const pubs = projectPubs(pr);
  const lead = pubs.find((p) => !p.status || p.status === 'published' || p.status === 'accepted') || pubs[0];
  const collaborators = [...new Set(pubs.flatMap((p) => p.authors).filter((a) => a !== 'et al.' && !isMe(a)))];
  const related = (d.related || []).map((s) => projectBySlug[s]).filter(Boolean);
  const links = [
    ...(lead ? pubLinks(lead).filter((l) => l.label !== 'Abstract') : []),
    ...(pr.links || []).map((l) => ({ ...l, href: l.url, icon: l.label === 'Code' ? 'code' : 'external', ext: true })),
    ...(d.links || []).map((l) => ({ ...l, href: l.url, icon: 'external', ext: true })),
  ];
  const facts = [
    d.period && ['When', esc(d.period)],
    d.context && ['Context', esc(d.context)],
    lead && ['Venue', `${esc(lead.venueShort || lead.venue)}${lead.status && lead.status !== 'published' ? ` (${STATUS[lead.status]})` : ''}`],
    collaborators.length && ['Collaborators', esc(collaborators.join(', '))],
    pr.tags?.length && ['Themes', pr.tags.map((t) => esc(tags[t])).join(', ')],
  ].filter(Boolean);
  const section = (s) => `<section class="prose-section">
      <h2>${esc(s.heading)}</h2>
      ${(s.paragraphs || []).map((t) => `<p>${esc(t)}</p>`).join('\n      ')}
      ${s.list ? `<ul class="bullets">${s.list.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
    </section>`;
  const gallery = (d.gallery || []).filter((g) => {
    if (!imgDims[g.file]) throw new Error(`Missing image ${g.file} for project ${pr.slug}`);
    return true;
  });
  const hero = gallery[0]?.file || pr.image;

  const body = `
<article class="project">
  <header class="page-header">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/')}">Home</a> / <a href="${u('/research/')}">Research</a></nav>
      <p class="eyebrow">${(pr.tags || []).map((t) => esc(tags[t])).join(' · ')}</p>
      <h1>${esc(pr.title)}</h1>
      <p class="lede">${esc(pr.description)}</p>
      ${links.length ? `<div class="actions">${links.map((l, i) => `<a class="btn${i === 0 ? ' btn-primary' : ''}" href="${esc(l.href)}"${l.ext ? ' target="_blank" rel="noopener"' : ''}>${icon(l.icon)}${esc(l.label === 'PDF' ? 'Read the paper (PDF)' : l.label)}</a>`).join('')}</div>` : ''}
    </div>
  </header>
  <div class="section section-tight">
    <div class="wrap project-layout">
      <div class="project-main">
        ${hero ? `<figure class="project-hero">${img(hero, gallery[0]?.caption || pr.title, { eager: true })}${gallery[0]?.caption ? `<figcaption>${esc(gallery[0].caption)}</figcaption>` : ''}</figure>` : ''}
        ${d.summary ? `<p class="project-summary">${esc(d.summary)}</p>` : ''}
        ${(d.sections || []).map(section).join('\n')}
        ${d.findings?.length ? `<section class="prose-section findings"><h2>${pr.tags?.includes('instruments') || !lead ? 'Highlights' : 'Key findings'}</h2><ul class="bullets">${d.findings.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></section>` : ''}
        ${d.video ? `<section class="prose-section"><h2>Video</h2>${videoEmbed(d.video)}</section>` : ''}
        ${gallery.length > 1 ? `<section class="prose-section"><h2>Gallery</h2><div class="gallery">${gallery.slice(1).map((g) => `<figure>${img(g.file, g.caption, { sizes: '(max-width: 700px) 100vw, 420px' })}<figcaption>${esc(g.caption)}</figcaption></figure>`).join('')}</div></section>` : ''}
        ${pubs.length ? `<section class="prose-section"><h2>Publications</h2><ol class="pubs">${pubs.map(pubItem).join('\n')}</ol></section>` : ''}
      </div>
      <aside class="project-aside">
        ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>` : ''}
        ${d.tools?.length ? `<h3>Tools &amp; methods</h3><ul class="tags tags-sm">${d.tools.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}
        ${d.code?.length ? `<h3>Code</h3><ul class="plain">${d.code.map((c) => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener">${icon('github')} ${esc(c.label)}</a></li>`).join('')}</ul>` : ''}
      </aside>
    </div>
  </div>
  ${related.length ? `<section class="section section-alt" aria-labelledby="related-h"><div class="wrap"><h2 id="related-h">Related projects</h2><div class="grid">${related.map(projectCard).join('\n')}</div></div></section>` : ''}
</article>`;

  const desc = (d.summary || pr.description).length > 158
    ? (d.summary || pr.description).slice(0, (d.summary || pr.description).lastIndexOf(' ', 155)) + '…'
    : d.summary || pr.description;
  const work = {
    '@type': 'CreativeWork',
    '@id': abs(projectPath(pr)) + '#project',
    name: pr.title,
    headline: pr.title,
    description: d.summary || pr.description,
    url: abs(projectPath(pr)),
    creator: { '@id': abs('/#person') },
    contributor: collaborators.map((name) => ({ '@type': 'Person', name })),
    keywords: [...(pr.tags || []).map((t) => tags[t]), ...(d.tools || [])].join(', '),
    ...(hero ? { image: abs('/assets/img/' + hero) } : {}),
    ...(pubs.length ? { citation: pubs.map((p) => ({ '@type': 'ScholarlyArticle', name: p.title, ...(p.doi ? { sameAs: `https://doi.org/${p.doi}` } : {}) })) } : {}),
  };
  return layout({
    title: pr.title,
    description: desc,
    path: projectPath(pr),
    body,
    ogType: 'article',
    image: hero ? '/assets/img/' + hero : site.ogImage,
    jsonld: [breadcrumbLd([['Research', '/research/'], [pr.title, projectPath(pr)]]), work, personLd],
  });
}

const filterBar = (entries, label) =>
  `<div class="filters" role="group" aria-label="${label}" data-filter-group>
  <button class="filter is-active" data-filter="all" aria-pressed="true">All</button>
  ${entries.map(([k, v]) => `<button class="filter" data-filter="${k}" aria-pressed="false">${esc(v)}</button>`).join('')}
</div>`;

// ------------------------------------------------------------------ pages

const pages = [];
const addPage = (p, html, { priority = '0.7', changefreq = 'monthly' } = {}) => pages.push({ path: p, html, priority, changefreq });

// Home --------------------------------------------------------------
{
  const featured = projects.filter((p) => p.featured);
  const recent = publications
    .filter((p) => (!p.status || p.status === 'published') && p.type !== 'poster' && p.type !== 'thesis')
    .slice(0, 6);
  const body = `
<section class="hero">
  <div class="wrap hero-inner">
    <div class="hero-text">
      <p class="eyebrow">${esc(site.credentialLine)}</p>
      <h1>${esc(site.name)}</h1>
      <p class="hero-tagline">${esc(site.tagline)}</p>
      <p class="hero-fields">${site.fieldsLine.map(esc).join('<span aria-hidden="true"> | </span>')}</p>
      <p class="hero-intro">${esc(site.intro)}</p>
      <div class="actions">
        <a class="btn btn-primary" href="${u(site.cvPdf)}">${icon('download')}Download CV</a>
        <a class="btn" href="${u('/research/')}">Explore research${icon('arrow')}</a>
      </div>
      ${socialLinks('social social-lg')}
    </div>
    <div class="hero-photo">
      ${img('stringesthesia-job-talk.webp', `${site.name}, seen from behind, playing guitar in an fNIRS brain-imaging cap during a Stringesthesia performance`, { eager: true, cls: 'portrait' })}
    </div>
  </div>
</section>

<section class="section" id="about" aria-labelledby="about-h">
  <div class="wrap about">
    <div>
      <h2 id="about-h">About</h2>
      ${site.bio.map((b) => `<p>${esc(b)}</p>`).join('\n      ')}
      <ul class="tags" aria-label="Research interests">${site.interests.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
    </div>
    <aside class="about-side">
      <h3>Currently</h3>
      <ul class="plain">${site.currentRoles.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <h3>Education</h3>
      <ul class="degrees">${site.degrees.map((d) => `<li><strong>${esc(d.degree)}</strong> ${esc(d.field)}<span>${esc(d.school)}</span></li>`).join('')}</ul>
      <a class="text-link" href="${u('/cv/')}">Full CV${icon('arrow')}</a>
    </aside>
  </div>
</section>

<section class="section section-alt" aria-labelledby="research-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="research-h">Selected Research</h2>
      <a class="text-link" href="${u('/research/')}">All projects${icon('arrow')}</a>
    </div>
    <div class="grid">${featured.map(projectCard).join('\n')}</div>
  </div>
</section>

<section class="section" aria-labelledby="pubs-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="pubs-h">Recent Publications</h2>
      <a class="text-link" href="${u('/publications/')}">All publications${icon('arrow')}</a>
    </div>
    <ol class="pubs">${recent.map(pubItem).join('\n')}</ol>
  </div>
</section>

<section class="section section-alt" aria-labelledby="perf-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="perf-h">Performances &amp; Installations</h2>
      <a class="text-link" href="${u('/performances/')}">All performances${icon('arrow')}</a>
    </div>
    <div class="grid">${performances.filter((p) => p.image).slice(0, 3).map(performanceCard).join('\n')}</div>
  </div>
</section>

<section class="section section-dark" id="contact" aria-labelledby="contact-h">
  <div class="wrap contact">
    <h2 id="contact-h">Get in Touch</h2>
    <p>${esc(site.jobMarket)}</p>
    ${emailLink(`${icon('mail')}${emailText}`, ' class="btn btn-light"')}
    ${socialLinks('social social-lg')}
    <a class="secret-door" href="https://soljamm.com" target="_blank" rel="noopener" aria-label="A hidden door to SolJAMM, the music education suite I am building">
      <span class="door-frame" aria-hidden="true"><span class="door-light"></span><span class="door-panel"><span class="door-knob"></span></span></span>
      <span class="door-hint" aria-hidden="true">SolJAMM →</span>
    </a>
  </div>
</section>`;
  addPage('/', layout({
    description: site.description,
    path: '/',
    body,
    ogType: 'profile',
    jsonld: [
      { '@type': 'WebSite', '@id': abs('/#website'), url: abs('/'), name: site.honorific, description: site.description, publisher: { '@id': abs('/#person') }, inLanguage: site.lang },
      { '@type': 'ProfilePage', '@id': abs('/#profile'), url: abs('/'), name: site.title, mainEntity: { '@id': abs('/#person') }, dateModified: BUILD_DATE },
      personLd,
    ],
  }), { priority: '1.0' });
}

// Research ----------------------------------------------------------
{
  const used = new Set(projects.flatMap((p) => p.tags || []));
  const body = `
${pageHeader('Research', 'Scientific, technical, and creative research spanning AI, extended reality, neuroscience, and music. Filter by theme, and open any project for the full story: motivation, methods, findings, media, and papers.', 'Publication and Scientific Works')}
<section class="section section-tight">
  <div class="wrap">
    ${filterBar(Object.entries(tags).filter(([k]) => used.has(k)), 'Filter projects by theme')}
    <div class="grid" data-filter-items>${projects.map(projectCard).join('\n')}</div>
  </div>
</section>`;
  addPage('/research/', layout({
    title: 'Research',
    description: `Research projects by ${site.name}: AI-driven virtual musicians, brain-computer interfaces, networked music in AR/VR, music cognition, and more.`,
    path: '/research/',
    body,
    jsonld: [
      breadcrumbLd([['Research', '/research/']]),
      { '@type': 'ItemList', name: 'Research projects', itemListElement: projects.map((pr, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(projectPath(pr)), name: pr.title })) },
      personLd,
    ],
  }), { priority: '0.9' });

  for (const pr of projects) {
    addPage(projectPath(pr), projectPage(pr), { priority: details[pr.slug]?.sections || details[pr.slug]?.findings ? '0.8' : '0.5' });
  }
}

// Publications list --------------------------------------------------
{
  const isMain = (p) => ['journal', 'conference', 'workshop'].includes(p.type) && (!p.status || p.status === 'published' || p.status === 'accepted');
  const groups = [
    ['Peer-Reviewed Publications', publications.filter(isMain)],
    ['Posters & Extended Abstracts', publications.filter((p) => p.type === 'poster')],
    ['Book Chapters', publications.filter((p) => p.type === 'chapter')],
    ['Dissertation', publications.filter((p) => p.type === 'thesis')],
    ['Under Review & In Preparation', publications.filter((p) => p.status === 'under-review' || p.status === 'in-preparation')],
  ];
  const byYear = (list) => {
    const years = [...new Set(list.map((p) => p.year))].sort((a, b) => b - a);
    return years.map((y) => `<div class="year-group"><h3 class="year">${y}</h3><ol class="pubs">${list.filter((p) => p.year === y).map(pubItem).join('\n')}</ol></div>`).join('\n');
  };
  const nPub = publications.filter((p) => !p.status || p.status === 'published').length;
  const body = `
${pageHeader('Publications', `${nPub} published works in HCI, computer science, engineering, neuroscience, and music venues. I primarily publish in venues with ~25% or lower acceptance rates.`)}
<section class="section section-tight">
  <div class="wrap">
    <div class="pub-tools">
      <label class="search">${icon('search')}<span class="sr-only">Search publications</span><input type="search" placeholder="Search titles, authors, venues…" data-pub-search></label>
      ${filterBar([['journal', 'Journal'], ['conference', 'Conference'], ['poster', 'Posters'], ['workshop', 'Workshop']], 'Filter publications by type')}
    </div>
    <p class="pub-empty" hidden>No publications match your search.</p>
    ${groups.filter(([, l]) => l.length).map(([h, l]) => `<section class="pub-group" data-filter-items><h2>${h}</h2>${byYear(l)}</section>`).join('\n')}
  </div>
</section>`;
  addPage('/publications/', layout({
    title: 'Publications',
    description: `Complete list of publications by ${site.name}, including NeurIPS, IJCAI, IEEE ISMAR, IEEE VR, Frontiers, NIME, and Audio Mostly papers, with PDFs.`,
    path: '/publications/',
    body,
    jsonld: [breadcrumbLd([['Publications', '/publications/']]), personLd],
  }), { priority: '0.9' });
}

// Individual paper pages (Google Scholar friendly) ------------------
for (const p of publications.filter(hasPage)) {
  const dateIso = (p.date || String(p.year)).replace(/\//g, '-');
  const citationVenue =
    p.type === 'journal' ? `<meta name="citation_journal_title" content="${esc(p.venue)}">`
      : p.type === 'thesis' ? `<meta name="citation_dissertation_institution" content="University of Colorado Boulder">`
      : `<meta name="citation_conference_title" content="${esc(p.venue)}">`;
  const [firstPage, lastPage] = (p.pages || '').split('–');
  const head = [
    `<meta name="citation_title" content="${esc(p.title)}">`,
    ...p.authors.filter((a) => a !== 'et al.').map((a) => `<meta name="citation_author" content="${esc(a.split(' ').at(-1) + ', ' + a.split(' ').slice(0, -1).join(' '))}">`),
    `<meta name="citation_publication_date" content="${p.date || p.year}">`,
    citationVenue,
    p.volume && `<meta name="citation_volume" content="${esc(p.volume)}">`,
    p.issue && `<meta name="citation_issue" content="${esc(p.issue)}">`,
    firstPage && `<meta name="citation_firstpage" content="${esc(firstPage)}">`,
    lastPage && `<meta name="citation_lastpage" content="${esc(lastPage)}">`,
    p.doi && `<meta name="citation_doi" content="${esc(p.doi)}">`,
    p.pdf && `<meta name="citation_pdf_url" content="${abs('/assets/papers/' + p.pdf)}">`,
    `<meta name="citation_abstract_html_url" content="${abs(pubPath(p))}">`,
    (p.keywords || []).length && `<meta name="citation_keywords" content="${esc(p.keywords.join('; '))}">`,
  ].filter(Boolean).join('\n');

  const article = {
    '@type': 'ScholarlyArticle',
    '@id': abs(pubPath(p)) + '#article',
    headline: p.title.slice(0, 110),
    name: p.title,
    author: p.authors.filter((a) => a !== 'et al.').map((a) => (isMe(a) ? { '@id': abs('/#person') } : { '@type': 'Person', name: a })),
    datePublished: dateIso,
    abstract: p.abstract,
    keywords: (p.keywords || []).join(', '),
    isPartOf: { '@type': p.type === 'journal' ? 'Periodical' : 'PublicationEvent', name: p.venue },
    url: abs(pubPath(p)),
    ...(p.image ? { image: abs('/assets/img/' + p.image) } : {}),
    ...(p.doi ? { sameAs: `https://doi.org/${p.doi}`, identifier: { '@type': 'PropertyValue', propertyID: 'DOI', value: p.doi } } : {}),
    ...(p.pdf ? { encoding: { '@type': 'MediaObject', contentUrl: abs('/assets/papers/' + p.pdf), encodingFormat: 'application/pdf' } } : {}),
  };

  const plain = `${p.authors.join(', ')}. ${p.year}. ${p.title}. ${p.venue}${p.pages ? `, ${p.pages}` : ''}.${p.doi ? ` https://doi.org/${p.doi}` : ''}`;
  const desc = p.abstract.length > 155 ? p.abstract.slice(0, p.abstract.lastIndexOf(' ', 152)) + '…' : p.abstract;
  const status = p.status && p.status !== 'published' ? `<span class="badge badge-status">${STATUS[p.status]}</span>` : '';
  const body = `
<article class="paper">
  <header class="page-header">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="${u('/')}">Home</a> / <a href="${u('/publications/')}">Publications</a></nav>
      <p class="eyebrow">${esc(TYPE[p.type])} · ${esc(p.venueShort || p.venue)}</p>
      <h1>${esc(p.title)}</h1>
      <p class="paper-authors">${authorsHtml(p.authors)}</p>
      <p class="paper-venue"><em>${esc(p.venue)}</em>${p.location ? `, ${esc(p.location)}` : ''}${locator(p) ? `, ${esc(locator(p))}` : ''}, ${p.year}. ${status}${p.note ? `<span class="badge">${esc(p.note)}</span>` : ''}${p.openAccess ? '<span class="badge badge-oa">Open access</span>' : ''}</p>
      <div class="actions">
        ${p.pdf ? `<a class="btn btn-primary" href="${u('/assets/papers/' + p.pdf)}">${icon('file')}Read PDF</a>` : ''}
        ${p.doi ? `<a class="btn" href="https://doi.org/${p.doi}" target="_blank" rel="noopener">${icon('external')}DOI: ${esc(p.doi)}</a>` : ''}
        ${p.url ? `<a class="btn" href="${esc(p.url)}" target="_blank" rel="noopener">${icon(p.urlLabel === 'Code' ? 'code' : 'external')}${esc(p.urlLabel || 'Link')}</a>` : ''}
      </div>
    </div>
  </header>
  <div class="section section-tight">
    <div class="wrap paper-body">
      ${p.image ? `<figure class="paper-figure">${img(p.image, `Figure from “${p.title}”`, { eager: true })}</figure>` : ''}
      <h2>Abstract</h2>
      <p class="abstract">${esc(p.abstract)}</p>
      ${(p.keywords || []).length ? `<ul class="tags" aria-label="Keywords">${p.keywords.map((k) => `<li>${esc(k)}</li>`).join('')}</ul>` : ''}
      <h2>Cite</h2>
      <p class="citation">${esc(plain)}</p>
      <div class="bibtex">
        <button class="btn btn-small copy-btn" data-copy="#bib-${p.id}">${icon('copy')}<span>Copy BibTeX</span></button>
        <pre id="bib-${p.id}"><code>${esc(bibtex(p))}</code></pre>
      </div>
      <p class="actions">${(projectsByPub[p.id] || []).map((pr) => `<a class="text-link" href="${u(projectPath(pr))}">Project: ${esc(pr.title)}${icon('arrow')}</a>`).join('')}<a class="text-link" href="${u('/publications/')}">All publications${icon('arrow')}</a></p>
    </div>
  </div>
</article>`;
  addPage(pubPath(p), layout({
    title: p.title,
    description: desc,
    path: pubPath(p),
    body,
    head,
    ogType: 'article',
    image: p.image ? '/assets/img/' + p.image : site.ogImage,
    jsonld: [breadcrumbLd([['Publications', '/publications/'], [p.title, pubPath(p)]]), article, personLd],
  }), { priority: '0.6', changefreq: 'yearly' });
}

// Performances ------------------------------------------------------
{
  const body = `
${pageHeader('Performances &amp; Installations', 'Creative performance and interactive installations, from neurofeedback guitar to AI-driven drummers and audience-driven mixed reality.')}
<section class="section section-tight">
  <div class="wrap">
    <div class="grid grid-2">${performances.map(performanceCard).join('\n')}</div>
    <p class="note">Performing musician since 1997: guitar, voice, and music technology.</p>
  </div>
</section>`;
  addPage('/performances/', layout({
    title: 'Performances & Installations',
    description: `Performances and interactive installations by ${site.name}, including CrowdForge, Stringesthesia, Rhythmic Conversations, and Galaga's Ghost.`,
    path: '/performances/',
    body,
    jsonld: [
      breadcrumbLd([['Performances', '/performances/']]),
      ...performances.map((pf) => ({
        '@type': 'CreativeWork', name: pf.title, description: pf.description, dateCreated: String(pf.year),
        creator: { '@id': abs('/#person') }, locationCreated: pf.venue,
        ...(pf.image ? { image: abs('/assets/img/' + pf.image) } : {}),
      })),
      personLd,
    ],
  }));
}

// CV ----------------------------------------------------------------
{
  const row = (when, html) => `<div class="cv-row"><div class="cv-when">${when}</div><div class="cv-what">${html}</div></div>`;
  const section = (title, rows, id) => `<section class="cv-section" id="${id}"><h2>${title}</h2>${rows}</section>`;
  const cvPub = (p) => {
    const extra = p.status && p.status !== 'published' ? ` (${STATUS[p.status]})` : '';
    const t = hasPage(p) ? `<a href="${u(pubPath(p))}">${esc(p.title)}</a>` : esc(p.title);
    return row(p.year, `${authorsHtml(p.authors)}. “${t}.” ${p.venue ? `<em>${esc(p.venue)}</em>` : ''}${p.location ? `, ${esc(p.location)}` : ''}${extra}.${p.note ? ` <strong>(${esc(p.note)})</strong>` : ''}`);
  };
  const ordered = (list) => [...list].sort((a, b) => b.year - a.year);
  const refereed = publications.filter((p) => ['journal', 'conference', 'workshop', 'thesis'].includes(p.type));
  const sections = [
    ['Research Interests', `<div class="cv-row"><div class="cv-when"></div><div class="cv-what"><p>I am an interdisciplinary researcher, educator, and performer specializing in the design of complex collaborative systems using advanced computational methods and analyzing human dynamics in the context of music.</p><p>My work exists at the intersection of AI, Human-Computer Interaction, Neuroscience, Psychology, Extended Reality, Health, and Music. I primarily publish in HCI, computer science, and engineering venues.</p><p><strong>Keywords:</strong> AI, system/interface design, brain-computer interfaces, extended reality, healthcare, psychology, and performance.</p></div></div>`, 'interests'],
    ['Education', cv.education.map((e) => row(e.years, `<strong>${esc(e.school)}</strong> — ${esc(e.place)}<br>${esc(e.degree)}${(e.details || []).map((d) => `<br><span class="muted">${d}</span>`).join('')}`)).join(''), 'education'],
    ['Research Experience', cv.experience.map((e) => row(e.years, `<strong>${esc(e.org)}</strong>${e.url ? `<a class="secret-door door-mini" href="${esc(e.url)}" target="_blank" rel="noopener" aria-label="${esc(e.org)} website" title="${esc(e.url.replace(/^https?:\/\//, ''))}"><span class="door-frame" aria-hidden="true"><span class="door-light"></span><span class="door-panel"><span class="door-knob"></span></span></span></a>` : ''}${e.place ? `, ${esc(e.place)}` : ''} — ${esc(e.role)}<br><span class="muted">${esc(e.summary)}</span>`)).join(''), 'experience'],
    ['Honors &amp; Distinctions', cv.awards.map(([y, a]) => row(y, a)).join(''), 'awards'],
    [`Funding <span class="muted">(contributed to awarded grants totaling <strong>${cv.fundingTotal}</strong>)</span>`, cv.funding.map((f) => row(f.years, `<strong>${esc(f.title)}</strong><br>${esc(f.amount)} · ${esc(f.agency)} · PI: ${esc(f.pi)}<br><span class="muted">${esc(f.contribution)}</span>`)).join(''), 'funding'],
    ['Refereed Publications', ordered(refereed).map(cvPub).join(''), 'publications'],
    ['Posters &amp; Extended Abstracts', ordered(publications.filter((p) => p.type === 'poster')).map(cvPub).join(''), 'posters'],
    ['Book Chapters', publications.filter((p) => p.type === 'chapter').map(cvPub).join(''), 'chapters'],
    ['Teaching', cv.teaching.map(([y, t]) => row(y, esc(t))).join(''), 'teaching'],
    ['Invited Talks, Keynotes &amp; Workshops', cv.talks.map(([y, t]) => row(y, esc(t))).join(''), 'talks'],
    ['Service', cv.service.map(([y, t]) => row(y, esc(t))).join(''), 'service'],
    ['Performances &amp; Exhibitions', [...performances.map((p) => row(p.year, `<strong>${esc(p.title)}</strong> — ${esc(p.venue)}`)), row('1997–Present', 'Performing musician: guitar, voice, music technology')].join(''), 'performances'],
  ];
  const body = `
${pageHeader('Curriculum Vitae', `${esc(site.honorific)} · ${emailLink(emailText)}`)}
<section class="section section-tight">
  <div class="wrap cv">
    <div class="cv-toolbar">
      <a class="btn btn-primary" href="${u(site.cvPdf)}">${icon('download')}Download PDF</a>
      <nav class="cv-toc" aria-label="CV sections">${sections.map(([t, , id]) => `<a href="#${id}">${t.replace(/<span.*<\/span>/, '').trim()}</a>`).join('')}</nav>
    </div>
    ${sections.map(([t, r, id]) => section(t, r, id)).join('\n')}
  </div>
</section>`;
  addPage('/cv/', layout({
    title: 'CV',
    description: `Curriculum vitae of ${site.name}: education, research experience, funding, publications, teaching, and service.`,
    path: '/cv/',
    body,
    jsonld: [breadcrumbLd([['CV', '/cv/']]), personLd],
  }), { priority: '0.9' });
}

// AI Music Resources -------------------------------------------------
{
  const body = `
${pageHeader('AI Music Resources', 'A curated list of generative AI tools, open-source code, and research models for music: generation, transcription, tagging, source separation, and singing synthesis.')}
<section class="section section-tight">
  <div class="wrap resources">
    ${resources.map((g) => `<section class="resource-group"><h2>${esc(g.heading)}</h2><ul>${g.items.map((i) => `<li><a href="${esc(i.url)}" target="_blank" rel="noopener">${esc(i.name)}${icon('external')}</a></li>`).join('')}</ul></section>`).join('\n')}
  </div>
</section>`;
  addPage('/ai-music-resources/', layout({
    title: 'AI Music Resources',
    description: 'Curated AI music resources: generative music tools (Suno, MusicGen, Magenta), open-source code, symbolic and audio generation models, transcription, tagging, source separation, datasets, and Python libraries.',
    path: '/ai-music-resources/',
    body,
    jsonld: [breadcrumbLd([['AI Music Resources', '/ai-music-resources/']]), personLd],
  }), { priority: '0.6' });
}

// ------------------------------------------------------------------ write output

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });
await cp('src/assets', path.join(OUT, 'assets'), { recursive: true });

for (const pg of pages) {
  const file = path.join(OUT, pg.path, 'index.html');
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, pg.html);
}

// 404 page (GitHub Pages serves /404.html for missing paths)
await writeFile(path.join(OUT, '404.html'), layout({
  title: 'Page not found',
  description: 'The page you were looking for could not be found.',
  path: '/404.html',
  head: '<meta name="robots" content="noindex">',
  body: `${pageHeader('Page not found', 'Sorry, that page doesn’t exist (it may have moved when this site was rebuilt).')}
<section class="section section-tight"><div class="wrap actions"><a class="btn btn-primary" href="${u('/')}">Go home</a><a class="btn" href="${u('/publications/')}">Publications</a><a class="btn" href="${u('/research/')}">Research</a></div></section>`,
}).replace('<meta name="robots" content="index, follow, max-image-preview:large">\n', ''));

// Sitemap & robots
await writeFile(path.join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((p) => `  <url><loc>${abs(p.path)}</loc><lastmod>${BUILD_DATE}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}
</urlset>
`);
await writeFile(path.join(OUT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${abs('/sitemap.xml')}\n`);

// Icons & manifest
// Colorful brain, one color per lobe
const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#141a2b"/><defs><clipPath id="b"><path d="M11 38C5 34 5 24 11 19C13 11 22 7 29 9C34 5 44 6 48 11C55 11 60 18 58 25C62 31 59 39 52 40C49 44 42 45 37 42C33 46 26 46 22 43C16 45 11 43 11 38Z"/></clipPath></defs><path d="M40 41 L44 54 L49 53 L46 40Z" fill="#8b5cf6"/><ellipse cx="49" cy="45" rx="8" ry="5.5" fill="#a855f7" stroke="#141a2b" stroke-width="1.8"/><g clip-path="url(#b)"><rect width="64" height="64" fill="#3b82f6"/><path d="M0 0H27L22 30L0 40Z" fill="#f97316"/><path d="M27 0H35L31 30L22 30Z" fill="#ef4444"/><path d="M35 0H64V22L45 28L31 30Z" fill="#facc15"/><path d="M0 40L22 30L31 30L45 28L40 64H0Z" fill="#14b8a6"/><path d="M45 28L64 22V64H40Z" fill="#ec4899"/><g fill="none" stroke="#141a2b" stroke-width="1.8" stroke-linecap="round"><path d="M0 40L22 30L31 30L45 28L64 22"/><path d="M27 0L22 30M35 0L31 30"/><path d="M45 28L40 64"/><path d="M12 22C15 26 11 29 14 33M17 13C20 17 16 20 19 24"/><path d="M40 12C42 16 38 19 41 23M50 15C49 19 53 21 52 25"/><path d="M18 38C21 35 25 40 29 36M32 38C35 35 36 40 39 37"/><path d="M50 30C53 32 51 35 55 36"/></g></g><path d="M11 38C5 34 5 24 11 19C13 11 22 7 29 9C34 5 44 6 48 11C55 11 60 18 58 25C62 31 59 39 52 40C49 44 42 45 37 42C33 46 26 46 22 43C16 45 11 43 11 38Z" fill="none" stroke="#141a2b" stroke-width="1.5"/></svg>`;
await writeFile(path.join(OUT, 'favicon.svg'), faviconSvg);
await sharp(Buffer.from(faviconSvg)).resize(32, 32).png().toFile(path.join(OUT, 'favicon-32.png'));
await cp(path.join(OUT, 'favicon-32.png'), path.join(OUT, 'favicon.ico'));
await sharp(Buffer.from(faviconSvg)).resize(180, 180).png().toFile(path.join(OUT, 'apple-touch-icon.png'));
await sharp(Buffer.from(faviconSvg)).resize(512, 512).png().toFile(path.join(OUT, 'icon-512.png'));
await writeFile(path.join(OUT, 'site.webmanifest'), JSON.stringify({
  name: site.honorific, short_name: site.name, start_url: u('/'), display: 'browser',
  background_color: '#ffffff', theme_color: '#681a1a',
  icons: [{ src: u('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }, { src: u('/icon-512.png'), sizes: '512x512', type: 'image/png' }],
}, null, 2));

// GitHub Pages: skip Jekyll processing; optional custom domain
await writeFile(path.join(OUT, '.nojekyll'), '');
if (process.env.CNAME) await writeFile(path.join(OUT, 'CNAME'), process.env.CNAME + '\n');

console.log(`Built ${pages.length} pages → ${OUT}/  (SITE_URL=${SITE_URL}, BASE_PATH=${BASE || '/'})`);

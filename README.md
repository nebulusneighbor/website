# torinhopkins.com

Personal academic website of **Torin Hopkins, PhD**. It covers research in music, computing, and neuroscience.

It is a small static site with no framework. A Node script renders the content files into plain HTML, and GitHub Actions deploys the result to GitHub Pages on every push to `main`.

## Quick start

```bash
npm install      # once
npm run dev      # build + preview at http://localhost:8080
```

## Updating content

All content lives in `content/`. Edit a file there, then run `npm run dev` to preview it.

| File | What it controls |
|---|---|
| `content/site.js` | Name, tagline, bio, current roles, social links, email (stored encoded), SEO description |
| `content/publications.js` | Every publication. Add `abstract` to give a paper its own page with Google Scholar meta tags |
| `content/projects.js` | Research project cards (`featured: true` shows a card on the home page), plus performances |
| `content/project-details.js` | The long-form project pages at `/research/<slug>/`: summary, sections, key findings, tools, video, gallery, code links, and related projects |
| `content/cv.js` | Education, experience, funding, awards, teaching, talks, and service |
| `content/resources.js` | AI Music Resources page |

**To add a paper PDF:** put it in `src/assets/papers/` and set `pdf: 'file-name.pdf'` on the publication.

**To add a project-page figure:** put the original in `raw/img/projects/`, run `npm run images`, and add it to that project's `gallery` as `projects/<name>.webp`. The first gallery image becomes the page's hero and share image.

**To add an image:** put the original in `raw/img/` and run `npm run images`. This writes an optimized `.webp` to `src/assets/img/`. Reference it as `image: 'name.webp'`. The `raw/` folder is git-ignored, so the originals stay local.

**To update the CV PDF:** replace `src/assets/papers/Torin_Hopkins_CV.pdf`.

## SEO features

- Unique `<title>`, meta description, and canonical URL on every page
- Open Graph and Twitter cards with a custom share image
- schema.org JSON-LD: `Person`, `ProfilePage`, `WebSite`, `ScholarlyArticle`, `BreadcrumbList`, and `CreativeWork`
- Google Scholar (Highwire `citation_*`) meta tags and hosted PDFs on each paper page
- `sitemap.xml`, `robots.txt`, a web manifest, and favicons
- Search-engine verification tags (`googleSiteVerification` / `bingSiteVerification` in `content/site.js`) and `rel="me"` links to every profile
- Fast pages: about 2 MB of optimized images, image sizes declared up front, lazy loading, no frameworks

## Deployment and custom domain

The workflow is in `.github/workflows/deploy.yml`. In the repo, go to **Settings → Pages** and set the **Source** to **GitHub Actions**.

To serve the site at `torinhopkins.com` once you are ready to leave PageCloud:

1. In **Settings → Pages → Custom domain**, enter `www.torinhopkins.com`.
2. At your DNS provider, add a `CNAME` record for `www` that points to `<your-github-username>.github.io`. Also add `A` records for the apex domain pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`.
3. Enable **Enforce HTTPS**.

Canonical URLs and the sitemap follow the Pages URL automatically.

After going live, submit `https://www.torinhopkins.com/sitemap.xml` in [Google Search Console](https://search.google.com/search-console).

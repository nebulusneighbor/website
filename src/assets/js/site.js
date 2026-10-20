// Progressive enhancement: everything is readable without JavaScript.
(() => {
  const root = document.documentElement;

  // Theme toggle (remembers choice; otherwise follows the OS setting)
  const toggle = document.querySelector('.theme-toggle');
  toggle?.addEventListener('click', () => {
    const dark = root.dataset.theme
      ? root.dataset.theme === 'dark'
      : matchMedia('(prefers-color-scheme: dark)').matches;
    root.dataset.theme = dark ? 'light' : 'dark';
    try { localStorage.setItem('theme', root.dataset.theme); } catch {}
  });

  // Mobile navigation
  const navBtn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  navBtn?.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    navBtn.setAttribute('aria-expanded', String(open));
  });
  nav?.addEventListener('click', (e) => {
    if (e.target.closest('a')) { nav.classList.remove('is-open'); navBtn?.setAttribute('aria-expanded', 'false'); }
  });

  // Filters (research themes / publication types) + publication search
  const group = document.querySelector('[data-filter-group]');
  const search = document.querySelector('[data-pub-search]');
  let active = 'all';

  const apply = () => {
    const q = (search?.value || '').trim().toLowerCase();
    const items = document.querySelectorAll('[data-filter-items] [data-tags]');
    let shown = 0;
    items.forEach((el) => {
      const tagOk = active === 'all' || el.dataset.tags.split(' ').includes(active);
      const textOk = !q || (el.dataset.search || el.textContent.toLowerCase()).includes(q);
      el.hidden = !(tagOk && textOk);
      if (!el.hidden) shown++;
    });
    // Hide empty year groups and sections on the publications page
    document.querySelectorAll('.year-group').forEach((g) => { g.hidden = !g.querySelector('.pub:not([hidden])'); });
    document.querySelectorAll('.pub-group').forEach((g) => { g.hidden = !g.querySelector('.pub:not([hidden])'); });
    const empty = document.querySelector('.pub-empty');
    if (empty) empty.hidden = shown > 0;
  };

  group?.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-filter]');
    if (!btn) return;
    active = btn.dataset.filter;
    group.querySelectorAll('[data-filter]').forEach((b) => {
      const on = b === btn;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    apply();
  });
  search?.addEventListener('input', apply);

  // Email links: the address ships encoded so scrapers can't read it from the HTML
  document.querySelectorAll('[data-em]').forEach((a) => {
    const email = [...atob(a.dataset.em)].reverse().join('');
    a.href = `mailto:${email}`;
    a.querySelectorAll('[data-em-text]').forEach((s) => { s.textContent = email; });
  });

  // Load YouTube players only when clicked (keeps pages fast and avoids tracking until then)
  document.querySelectorAll('[data-youtube]').forEach((a) => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube-nocookie.com/embed/${a.dataset.youtube}?autoplay=1`;
      iframe.title = a.getAttribute('aria-label') || 'Video';
      iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      iframe.allowFullscreen = true;
      a.replaceWith(iframe);
    });
  });

  // Copy BibTeX
  document.querySelectorAll('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const text = document.querySelector(btn.dataset.copy)?.textContent || '';
      const label = btn.querySelector('span');
      try {
        await navigator.clipboard.writeText(text);
        label.textContent = 'Copied!';
      } catch {
        label.textContent = 'Press Ctrl+C';
        const range = document.createRange();
        range.selectNodeContents(document.querySelector(btn.dataset.copy));
        getSelection().removeAllRanges();
        getSelection().addRange(range);
      }
      setTimeout(() => { label.textContent = 'Copy BibTeX'; }, 2000);
    });
  });
})();

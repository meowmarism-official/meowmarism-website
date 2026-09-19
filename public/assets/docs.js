// Documentation shell: sidebar, breadcrumbs, "on this page", previous/next and search. No build step.
(() => {
  const MANIFEST = [
    { group: 'Start', items: [
      { t: 'Introduction', p: '/docs/' },
      { t: 'Getting started', p: '/docs/getting-started/' },
    ] },
    { group: 'Using meowmarism', items: [
      { t: 'Instances', p: '/docs/instances/' },
      { t: 'The dashboard', p: '/docs/dashboard/' },
      { t: 'Mods and plugins', p: '/docs/mods/' },
      { t: 'Backups', p: '/docs/backups/' },
      { t: 'Scheduler and automation', p: '/docs/scheduler/' },
      { t: 'Startup, Java and limits', p: '/docs/startup/' },
      { t: 'Upgrading a server', p: '/docs/upgrading/' },
    ] },
    { group: 'Administration', items: [
      { t: 'Accounts and permissions', p: '/docs/accounts/' },
      { t: 'Updating meowmarism', p: '/docs/updating/' },
      { t: 'HTTPS and internet access', p: '/docs/https/' },
      { t: 'Configuration', p: '/docs/configuration/' },
      { t: 'Uninstall', p: '/docs/uninstall/' },
    ] },
    { group: 'Help', items: [
      { t: 'Troubleshooting', p: '/docs/troubleshooting/' },
    ] },
  ];
  const flat = MANIFEST.flatMap((g) => g.items.map((i) => ({ ...i, group: g.group })));
  const norm = (p) => p.replace(/index\.html$/, '').replace(/\/?$/, '/');
  const here = norm(location.pathname);
  const idx = flat.findIndex((i) => i.p === here);
  const cur = flat[idx];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const SEARCH_ICON = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>';
  const MENU_ICON = '<svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  const COPY_ICON = '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';

  // sidebar
  const nav = document.getElementById('docsNav');
  if (nav) {
    nav.innerHTML = `<button class="ds-search" id="dsOpen" type="button">${SEARCH_ICON}<span>Search docs</span><kbd>Ctrl K</kbd></button>`
      + MANIFEST.map((g) => `<div class="ds-group"><h4>${esc(g.group)}</h4>${g.items.map((i) => `<a href="${i.p}"${i.p === here ? ' class="on" aria-current="page"' : ''}>${esc(i.t)}</a>`).join('')}</div>`).join('');
  }

  const doc = document.getElementById('doc');
  if (doc) {
    // menu button on small screens
    const menu = document.createElement('button');
    menu.type = 'button';
    menu.className = 'ds-menu';
    menu.innerHTML = `${MENU_ICON}<span>Docs menu</span>`;
    doc.parentNode.insertBefore(menu, doc);
    menu.addEventListener('click', () => nav.classList.toggle('open'));
    document.addEventListener('click', (e) => { if (nav.classList.contains('open') && !nav.contains(e.target) && !menu.contains(e.target)) nav.classList.remove('open'); });

    // breadcrumbs and title
    const h1 = doc.querySelector('h1');
    if (cur && h1) {
      const crumbs = document.createElement('div');
      crumbs.className = 'crumbs';
      crumbs.innerHTML = `<a href="/docs/">Docs</a> / ${esc(cur.group)}`;
      h1.parentNode.insertBefore(crumbs, h1);
      document.title = `${cur.t} - meowmarism docs`;
    }

    // heading anchors and "on this page"
    const used = new Set();
    const heads = [...doc.querySelectorAll('h2, h3')];
    heads.forEach((h) => {
      let id = h.id || slug(h.textContent);
      while (used.has(id)) id += '-2';
      used.add(id);
      h.id = id;
      h.insertAdjacentHTML('beforeend', `<a class="anchor" href="#${id}" aria-label="Link to this section">#</a>`);
    });
    const toc = document.getElementById('docsToc');
    if (toc && heads.length > 1) {
      toc.innerHTML = '<div class="toc-title">On this page</div>' + heads.map((h) => `<a href="#${h.id}" class="${h.tagName.toLowerCase()}">${esc(h.firstChild.textContent)}</a>`).join('');
      const links = [...toc.querySelectorAll('a')];
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { links.forEach((l) => l.classList.toggle('on', l.getAttribute('href') === '#' + e.target.id)); } });
      }, { rootMargin: '-72px 0px -70% 0px' });
      heads.forEach((h) => io.observe(h));
    }

    // copy buttons
    doc.querySelectorAll('pre').forEach((pre) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'pre-copy';
      b.setAttribute('aria-label', 'Copy');
      b.innerHTML = COPY_ICON;
      b.addEventListener('click', () => {
        const text = pre.innerText.replace(/^\s*\$\s?/gm, '').trim();
        navigator.clipboard?.writeText(text).then(() => { b.classList.add('copied'); setTimeout(() => b.classList.remove('copied'), 1400); }).catch(() => {});
      });
      pre.appendChild(b);
    });

    // previous / next and edit link
    const pager = document.getElementById('docsPager');
    if (pager && cur) {
      const prev = flat[idx - 1], next = flat[idx + 1];
      pager.innerHTML = `<div class="pager">${prev ? `<a class="prev" href="${prev.p}"><small>Previous</small>${esc(prev.t)}</a>` : '<span></span>'}${next ? `<a class="next" href="${next.p}"><small>Next</small>${esc(next.t)}</a>` : ''}</div>`;
    }
  }

  // search
  let index = null;
  async function loadIndex() {
    if (index) return index;
    index = [];
    await Promise.all(flat.map(async (page) => {
      try {
        const html = await (await fetch(page.p)).text();
        const art = new DOMParser().parseFromString(html, 'text/html').querySelector('#doc');
        if (!art) return;
        let section = page.t;
        art.querySelectorAll('h1,h2,h3,p,li,td').forEach((el) => {
          const text = el.textContent.replace(/\s+/g, ' ').replace(/#$/, '').trim();
          if (!text) return;
          if (/^H/.test(el.tagName)) { section = text; index.push({ page, section, id: el.tagName === 'H1' ? '' : slug(text), text: '', head: true }); }
          else index.push({ page, section, id: slug(section), text, head: false });
        });
      } catch (_) { /* a page that cannot be read is skipped */ }
    }));
    return index;
  }
  const modal = document.createElement('div');
  modal.className = 'ds-modal';
  modal.innerHTML = '<div class="ds-box" role="dialog" aria-modal="true" aria-label="Search the documentation"><input id="dsInput" type="text" placeholder="Search the documentation..." autocomplete="off" spellcheck="false"><div class="ds-results" id="dsResults"></div></div>';
  document.body.appendChild(modal);
  const input = modal.querySelector('#dsInput');
  const out = modal.querySelector('#dsResults');
  let hits = [], sel = 0;
  const hl = (text, terms) => { let s = esc(text); terms.forEach((t) => { s = s.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); }); return s; };
  function render() {
    out.innerHTML = hits.length ? hits.map((h, i) => `<a href="${h.page.p}${h.id ? '#' + h.id : ''}" class="${i === sel ? 'sel' : ''}"><small>${esc(h.page.t)}${h.section !== h.page.t ? ' / ' + esc(h.section) : ''}</small><span>${h.snippet}</span></a>`).join('') : `<div class="ds-empty">${input.value.trim() ? 'Nothing found' : 'Type to search'}</div>`;
  }
  async function run() {
    const q = input.value.trim().toLowerCase();
    if (!q) { hits = []; render(); return; }
    const terms = q.split(/\s+/).filter(Boolean);
    const all = await loadIndex();
    const scored = [];
    for (const e of all) {
      const hay = (e.section + ' ' + e.text).toLowerCase();
      if (!terms.every((t) => hay.includes(t))) continue;
      const inHead = terms.every((t) => e.section.toLowerCase().includes(t));
      scored.push({ ...e, score: (inHead ? 10 : 0) + (e.head ? 5 : 0) + (e.page.t.toLowerCase().includes(terms[0]) ? 3 : 0), snippet: hl((e.head ? e.section : e.text).slice(0, 170), terms) });
    }
    scored.sort((a, b) => b.score - a.score);
    const seen = new Set();
    hits = scored.filter((h) => { const k = h.page.p + '|' + h.id; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 12);
    sel = 0;
    render();
  }
  const open = () => { modal.classList.add('open'); input.value = ''; hits = []; render(); input.focus(); loadIndex(); };
  const close = () => modal.classList.remove('open');
  document.addEventListener('click', (e) => { if (e.target.closest('#dsOpen')) open(); else if (e.target === modal) close(); });
  document.addEventListener('keydown', (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); return; }
    if (e.key === '/' && !typing && document.getElementById('dsOpen')) { e.preventDefault(); open(); return; }
    if (!modal.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown' && hits.length) { e.preventDefault(); sel = (sel + 1) % hits.length; render(); out.querySelector('.sel')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp' && hits.length) { e.preventDefault(); sel = (sel - 1 + hits.length) % hits.length; render(); out.querySelector('.sel')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter' && hits[sel]) { location.href = `${hits[sel].page.p}${hits[sel].id ? '#' + hits[sel].id : ''}`; close(); }
  });
  input.addEventListener('input', run);
})();

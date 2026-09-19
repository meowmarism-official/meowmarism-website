// Renders a Markdown legal text (headings, paragraphs, lists, quotes) from a raw GitHub URL.
(() => {
  const root = document.getElementById('legal');
  const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const inline = (s) => esc(s).replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  function render(md) {
    const lines = md.replace(/\r\n/g, '\n').split('\n');
    let html = '', toc = '', list = null, para = [], quote = [], n = 0;
    const flush = () => {
      if (para.length) { html += `<p>${inline(para.join(' '))}</p>`; para = []; }
      if (list) { html += `</${list}>`; list = null; }
      if (quote.length) { html += `<blockquote>${quote.map(inline).join('<br>')}</blockquote>`; quote = []; }
    };
    for (const raw of lines) {
      const line = raw.trimEnd();
      let m;
      if (/^# /.test(line) || /^Copyright/.test(line)) { flush(); continue; }
      if ((m = line.match(/^## (.+)/))) {
        flush();
        const num = m[1].match(/^(\d+)\.\s+(.*)/);
        const id = 's' + (++n);
        toc += `<a href="#${id}">${num ? `<span>${num[1]}</span>${esc(num[2])}` : esc(m[1])}</a>`;
        html += `<h2 id="${id}">${num ? `<span class="num">${num[1]}</span>${inline(num[2])}` : inline(m[1])}</h2>`;
        continue;
      }
      if ((m = line.match(/^### (.+)/))) { flush(); html += `<h3>${inline(m[1])}</h3>`; continue; }
      if ((m = line.match(/^(?:[-*]|\d+\.)\s+(.+)/))) {
        const kind = /^\d/.test(line) ? 'ol' : 'ul';
        if (para.length || quote.length || (list && list !== kind)) flush();
        if (!list) { html += `<${kind}>`; list = kind; }
        html += `<li>${inline(m[1])}</li>`;
        continue;
      }
      if ((m = line.match(/^>\s?(.*)/))) { if (para.length || list) flush(); quote.push(m[1]); continue; }
      if (!line.trim()) { flush(); continue; }
      if (list) flush();
      para.push(line.trim());
    }
    flush();
    return { html, toc };
  }

  fetch(root.dataset.src)
    .then((r) => { if (!r.ok) throw new Error('GitHub responded with ' + r.status); return r.text(); })
    .then((text) => {
      const { html, toc } = render(text);
      const first = text.split('\n').find((l) => /^Copyright/.test(l)) || '';
      root.innerHTML = `<aside class="ltoc"><b>Sections</b>${toc}</aside><article class="lbody">${first ? `<p class="lmeta">${esc(first)}</p>` : ''}${html}</article>`;
      if (location.hash) { const t = document.querySelector(location.hash); if (t) t.scrollIntoView(); }
    })
    .catch((err) => { root.innerHTML = `<p class="error">Couldn't load the text from GitHub (${esc(err.message)}). Read it directly on <a href="${root.dataset.gh}" target="_blank" rel="noopener">GitHub</a> instead.</p>`; });
})();

// Shared top navigation and footer, injected on every page so they are identical everywhere.
(() => {
  const links = [
    { href: '/lite/', label: 'LITE' },
    { href: '/professional/', label: 'PROFESSIONAL', short: 'PRO' },
    { href: '/docs/', label: 'Docs' },
    { href: 'https://github.com/meowmarism-official/meowmarism-lite/releases', label: 'Releases', external: true },
    { href: 'https://github.com/meowmarism-official', label: 'GitHub', external: true },
  ];
  const style = document.createElement('style');
  style.textContent = `
.topnav{position:relative;z-index:50;background:transparent}
.topnav-in{width:min(1040px,calc(100% - 32px));height:60px;margin:0 auto;display:flex;align-items:center;gap:26px}
.topnav .logo{display:flex;align-items:center;flex:0 0 auto}
.topnav .logo img{height:26px;width:auto;display:block}
.topnav nav{display:flex;align-items:center;gap:22px;overflow-x:auto;scrollbar-width:none}
.topnav nav::-webkit-scrollbar{display:none}
.topnav nav a{color:#9aa3b2;text-decoration:none;font-size:14px;white-space:nowrap;transition:color .12s}
.topnav nav a:hover,.topnav nav a.on{color:#f5f5f7}
.topnav nav a svg{width:11px;height:11px;margin-left:4px;vertical-align:-1px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.55}
.topnav .short{display:none}
@media (max-width:520px){.topnav .full{display:none}.topnav .short{display:inline}.topnav nav{gap:16px}}
.sitefoot{position:relative;z-index:2;width:min(1040px,calc(100% - 32px));margin:56px auto 0;padding:18px 0 34px;border-top:1px solid rgba(255,255,255,.08);color:#5f6878;font-size:12px;line-height:1.6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.sitefoot .links{margin-top:10px;display:flex;gap:14px;flex-wrap:wrap}
.sitefoot a{color:#9aa3b2;text-decoration:none;font-size:12px}
.sitefoot a:hover{color:#ff6fc4}
.sitefoot svg{width:13px;height:13px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;vertical-align:-2px;margin-right:5px}
`;
  document.head.appendChild(style);
  const here = location.pathname.replace(/\/?$/, '/');
  const on = (l) => !l.external && (here === l.href || (l.href === '/docs/' && here.startsWith('/docs/')));
  const nav = document.createElement('header');
  nav.className = 'topnav';
  nav.innerHTML = `<div class="topnav-in"><a class="logo" href="/" aria-label="meowmarism"><img src="/assets/favicon.svg" alt=""></a><nav>${links.map((l) => `<a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}${on(l) ? ' class="on"' : ''}>${l.short ? `<span class="full">${l.label}</span><span class="short">${l.short}</span>` : l.label}${l.external ? '<svg viewBox="0 0 24 24"><path d="M7 17L17 7"/><polyline points="8 7 17 7 17 16"/></svg>' : ''}</a>`).join('')}</nav></div>`;
  document.body.insertBefore(nav, document.body.firstChild);

  const foot = document.createElement('footer');
  foot.className = 'sitefoot';
  foot.innerHTML = "Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft. <div class=\"links\"> <a href=\"/license\"> <svg viewBox=\"0 0 24 24\"><path d=\"m16 6-4-4-4 4\"/><path d=\"M12 2v13\"/><path d=\"M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6\"/></svg> License </a> <a href=\"/terms\"> <svg viewBox=\"0 0 24 24\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/><line x1=\"8\" y1=\"13\" x2=\"16\" y2=\"13\"/><line x1=\"8\" y1=\"17\" x2=\"16\" y2=\"17\"/></svg> Terms </a> <a href=\"/imprint\"> <svg viewBox=\"0 0 24 24\"><path d=\"M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z\"/><polyline points=\"14 2 14 8 20 8\"/></svg> Imprint </a> <a href=\"/privacy\"> <svg viewBox=\"0 0 24 24\"><path d=\"M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z\"/></svg> Privacy </a> </div>";
  document.body.appendChild(foot);
})();

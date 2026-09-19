// Shared top navigation, injected on every page so the markup lives in one place.
(() => {
  const links = [
    { href: '/docs/', label: 'Docs' },
    { href: '/setup-guide/', label: 'Setup guide' },
    { href: 'https://github.com/meowmarism-official/meowmarism-lite/releases', label: 'Releases', external: true },
    { href: 'https://github.com/meowmarism-official', label: 'GitHub', external: true },
  ];
  const style = document.createElement('style');
  style.textContent = `
.topnav{position:sticky;top:0;z-index:50;background:rgba(6,9,15,.78);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid rgba(255,255,255,.08)}
.topnav-in{width:min(1040px,calc(100% - 32px));height:56px;margin:0 auto;display:flex;align-items:center;gap:26px}
.topnav .logo{display:flex;align-items:center;flex:0 0 auto}
.topnav .logo img{height:26px;width:auto;display:block}
.topnav nav{display:flex;align-items:center;gap:22px;overflow-x:auto;scrollbar-width:none}
.topnav nav::-webkit-scrollbar{display:none}
.topnav nav a{color:#9aa3b2;text-decoration:none;font-size:14px;white-space:nowrap;transition:color .12s}
.topnav nav a:hover,.topnav nav a.on{color:#f5f5f7}
.topnav nav a svg{width:11px;height:11px;margin-left:4px;vertical-align:-1px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;opacity:.55}
`;
  document.head.appendChild(style);
  const here = location.pathname.replace(/\/?$/, '/');
  const nav = document.createElement('header');
  nav.className = 'topnav';
  nav.innerHTML = `<div class="topnav-in"><a class="logo" href="/" aria-label="meowmarism"><img src="/assets/favicon.svg" alt=""></a><nav>${links.map((l) => `<a href="${l.href}"${l.external ? ' target="_blank" rel="noopener"' : ''}${!l.external && here === l.href ? ' class="on"' : ''}>${l.label}${l.external ? '<svg viewBox="0 0 24 24"><path d="M7 17L17 7"/><polyline points="8 7 17 7 17 16"/></svg>' : ''}</a>`).join('')}</nav></div>`;
  document.body.insertBefore(nav, document.body.firstChild);
})();

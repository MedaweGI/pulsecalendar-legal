// PulseCalendar — bascule clair/sombre.
// Sombre = design historique (défaut). Clair = style "Apple Store" des
// mockups : fond blanc/lavande, encre #1d1d1f, devices inchangés (sombres).
// Chargé SANS defer dans <head> : pose data-theme avant le premier paint
// (pas de flash), puis injecte le bouton dans .nav-inner quand la nav
// existe (nav statique d'index OU nav injectée par nav-footer.js).
(function () {
  var KEY = 'pulse_theme';
  var theme = 'dark';
  try { if (localStorage.getItem(KEY) === 'light') theme = 'light'; } catch (e) {}
  // Override ponctuel via ?theme=light|dark (test/partage — non persisté)
  var q = /[?&]theme=(light|dark)/.exec(window.location.search);
  if (q) theme = q[1];
  var root = document.documentElement;
  root.setAttribute('data-theme', theme);

  function syncMeta() {
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', theme === 'light' ? '#fbfbfd' : '#6244D6');
  }

  // Soleil (proposé en sombre) / lune (proposée en clair)
  var SUN = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4.4"/><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>';
  var MOON = '<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.2 14.2A8.3 8.3 0 0 1 9.8 3.8a8.3 8.3 0 1 0 10.4 10.4Z"/></svg>';

  function icon() { return theme === 'dark' ? SUN : MOON; }

  function refresh() {
    var btns = document.querySelectorAll('.theme-toggle');
    for (var i = 0; i < btns.length; i++) btns[i].innerHTML = icon();
  }

  window.pulseToggleTheme = function () {
    theme = theme === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
    syncMeta();
    refresh();
  };

  function inject() {
    var inner = document.querySelector('.nav-inner');
    if (!inner) { setTimeout(inject, 120); return; }   // nav-footer.js pas encore passé
    if (inner.querySelector('.theme-toggle')) return;
    var b = document.createElement('button');
    b.className = 'theme-toggle';
    b.type = 'button';
    b.setAttribute('aria-label', 'Basculer entre thème clair et sombre');
    b.innerHTML = icon();
    b.addEventListener('click', window.pulseToggleTheme);
    var cta = inner.querySelector('.nav-cta');
    if (cta) inner.insertBefore(b, cta); else inner.appendChild(b);
  }

  syncMeta();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();

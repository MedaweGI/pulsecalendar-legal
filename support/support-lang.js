// Externalized from inline <script> for a strict CSP (no 'unsafe-inline').
(function () {
  function setLang(lang) {
    document.querySelectorAll('[data-lang]').forEach(function (el) {
      el.classList.toggle('visible', el.dataset.lang === lang);
    });
    document.querySelectorAll('.lang-switch button').forEach(function (btn) {
      btn.classList.remove('active');
    });
    var active = document.getElementById('btn-' + lang);
    if (active) active.classList.add('active');
    document.documentElement.lang = lang;
    localStorage.setItem('pulse_support_lang', lang);
  }

  // Wire buttons (replaces inline onclick="setLang('xx')")
  document.querySelectorAll('.lang-switch button').forEach(function (btn) {
    btn.addEventListener('click', function () {
      setLang(btn.id.replace('btn-', ''));
    });
  });

  // Auto-detect from saved pref or browser locale on first visit
  var saved = localStorage.getItem('pulse_support_lang');
  if (saved) {
    setLang(saved);
  } else {
    var browserLang = (navigator.language || 'fr').slice(0, 2);
    if (['fr', 'en', 'es', 'ja'].includes(browserLang)) setLang(browserLang);
  }
})();

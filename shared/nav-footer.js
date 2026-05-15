// Shared nav + footer injector for PulseCalendar SEO sub-pages
(function () {
  const path = window.location.pathname;
  const segs = path.split('/').filter(Boolean);
  // depth = how many directories deep from root the current file lives
  const depth = Math.max(0, segs.length - 1);
  const home = depth === 0 ? './' : '../'.repeat(depth);

  const NAV = `
<nav class="nav">
  <div class="nav-inner">
    <a href="${home}index.html" class="nav-brand">
      <span class="nav-brand-icon"></span>
      <span>PulseCalendar</span>
    </a>
    <div class="nav-links">
      <a href="${home}index.html#features">Fonctionnalités</a>
      <a href="${home}index.html#themes">Thèmes</a>
      <a href="${home}index.html#pricing">Premium</a>
      <a href="${home}index.html#faq">FAQ</a>
    </div>
    <a href="${home}index.html#cta" class="nav-cta">Notifier au lancement</a>
  </div>
</nav>`;

  const FOOTER = `
<footer>
  <div class="foot-inner">
    <div class="foot-brand">
      <a href="${home}index.html" class="nav-brand">
        <span class="nav-brand-icon"></span>
        <span>PulseCalendar</span>
      </a>
      <p>Smart calendar app et anti-procrastination coach pour iPhone. Intelligence 100 % locale.</p>
      <p style="margin-top:10px;font-size:12px;color:var(--text-3)">🇫🇷 🇨🇦 🇺🇸 🇬🇧 🇦🇺 🇪🇸 🇯🇵 🇩🇪</p>
    </div>
    <div class="foot-col">
      <h4>Fonctionnalités</h4>
      <ul>
        <li><a href="${home}features/smart-calendar.html">Smart calendar app</a></li>
        <li><a href="${home}features/ai-calendar.html">Coach intelligent</a></li>
        <li><a href="${home}features/anti-procrastination.html">Anti-procrastination</a></li>
        <li><a href="${home}features/focus-planner.html">Focus planner iOS</a></li>
        <li><a href="${home}features/adhd-calendar.html">ADHD calendar app</a></li>
        <li><a href="${home}features/schedule-optimizer.html">Schedule optimizer</a></li>
      </ul>
    </div>
    <div class="foot-col">
      <h4>Ressources</h4>
      <ul>
        <li><a href="${home}index.html#faq">FAQ</a></li>
        <li><a href="${home}support/index.html">Support</a></li>
        <li><a href="${home}privacy.html">Confidentialité</a></li>
        <li><a href="${home}terms.html">Conditions</a></li>
        <li><a href="mailto:Contact@PulseCalendar.app">Contact</a></li>
      </ul>
    </div>
  </div>
  <div class="foot-bottom">
    <span>© 2026 PulseCalendar · pulsecalendar.app</span>
    <span>Made with ♥ in France</span>
  </div>
</footer>`;

  const navMount = document.getElementById('nav-mount');
  const footerMount = document.getElementById('footer-mount');
  if (navMount) navMount.outerHTML = NAV;
  if (footerMount) footerMount.outerHTML = FOOTER;
})();

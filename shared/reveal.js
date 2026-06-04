// Externalized from inline <script> for a strict CSP (no 'unsafe-inline').
(function () {
  // Reveal-on-scroll
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // App Store badge hover lift (replaces inline onmouseover/onmouseout)
  document.querySelectorAll('.js-hover-lift').forEach(function (a) {
    a.addEventListener('mouseenter', function () { a.style.transform = 'translateY(-2px)'; });
    a.addEventListener('mouseleave', function () { a.style.transform = 'translateY(0)'; });
  });
})();

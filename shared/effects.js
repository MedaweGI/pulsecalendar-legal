/* PulseCalendar — Pro effects controller
   Cursor spotlight, scroll progress, magnetic CTAs,
   nav scrolled class, marquee duplication, stagger reveals */

(function () {
  // === Cursor spotlight (desktop) ===
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches
      && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const spot = document.createElement('div');
    spot.className = 'spotlight';
    document.body.appendChild(spot);
    let raf = null;
    document.addEventListener('mousemove', (e) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        spot.style.left = e.clientX + 'px';
        spot.style.top = e.clientY + 'px';
        spot.style.opacity = '1';
      });
    });
    document.addEventListener('mouseleave', () => { spot.style.opacity = '0'; });
  }

  // === Scroll progress bar + nav scrolled class ===
  const nav = document.querySelector('.nav');
  let progress = null;
  if (nav) {
    progress = document.createElement('div');
    progress.className = 'scroll-progress';
    nav.appendChild(progress);
  }
  function onScroll() {
    const sc = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = Math.min(100, (sc / Math.max(1, max)) * 100);
    if (progress) progress.style.width = pct + '%';
    if (nav) nav.classList.toggle('scrolled', sc > 24);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // === Magnetic hover on buttons (subtle) ===
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches
      && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('.btn-appstore, .nav-cta, .contact-email, .btn-secondary, #cta form button')
      .forEach((el) => {
        el.addEventListener('mousemove', (e) => {
          const r = el.getBoundingClientRect();
          const mx = e.clientX - (r.left + r.width / 2);
          const my = e.clientY - (r.top + r.height / 2);
          el.style.transform = `translate(${mx * 0.18}px, ${my * 0.18}px)`;
        });
        el.addEventListener('mouseleave', () => { el.style.transform = ''; });
      });
  }

  // === Duplicate countries list for seamless marquee ===
  const cList = document.querySelector('.countries-list');
  if (cList && !cList.dataset.duped) {
    const clone = cList.innerHTML;
    cList.innerHTML = clone + clone;
    cList.dataset.duped = '1';
  }

  // === Stagger reveal — uses existing .reveal class
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = (i % 6) * 60 + 'ms';
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // === Stagger reveal for price cards on their own
  const cardIo = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        e.target.style.transitionDelay = i * 120 + 'ms';
        e.target.classList.add('in');
        cardIo.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.price-card, .privacy-pill, .country').forEach((el) => {
    el.classList.add('reveal');
    cardIo.observe(el);
  });

// === Counter animation ===
const counterIo = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const final = el.textContent.trim();
    const num = parseFloat(final.replace(/[^\d.,]/g, '').replace(',', '.'));
    if (!num || el.dataset.animated) return;
    el.dataset.animated = '1';
    const suffix = final.replace(/[\d\s.,]/g, '');
    const isFloat = /[.,]/.test(final) && num < 100;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = num * eased;
      el.textContent = (isFloat ? val.toFixed(1).replace('.', ',') : Math.round(val).toLocaleString('fr-FR')) + suffix;
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = final; // restore exact string at end
    }
    requestAnimationFrame(step);
    counterIo.unobserve(el);
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-counter]').forEach((el) => counterIo.observe(el));

})();

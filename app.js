/* RO Care India — shared site behavior */
(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');

  // Solid header on scroll (index has a transparent-over-hero header).
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle.
  if (toggle && nav) {
    toggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => nav.classList.remove('open')));
  }

  // Reveal-on-scroll.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Footer year.
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  // Booking form (client-side confirmation; wire to a backend/Formspree to actually send).
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const ok = document.getElementById('formSuccess');
      const name = (document.getElementById('bkName') || {}).value || 'there';
      if (ok) {
        ok.textContent = `Thanks, ${name.split(' ')[0]}! Your service request is received — our team will call you shortly to confirm the visit.`;
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }
})();

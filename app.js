/* RO Care India — shared site behavior */
(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  const film   = document.getElementById('film'); // present only on the home page

  // Header stays transparent over the video hero, then turns solid white once
  // you scroll past the film into the content. On inner pages (no film) it
  // turns solid after a small scroll.
  function onScroll() {
    if (!header) return;
    let solid;
    if (film) {
      const hH = header.offsetHeight || 74;
      solid = window.scrollY > (film.offsetHeight - hH - 4);
    } else {
      solid = window.scrollY > 40;
    }
    header.classList.toggle('scrolled', solid);
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

/* RO Care India — shared site behavior */

/* =====================================================================
   ✏️  EDIT YOUR BUSINESS DETAILS HERE — the whole site updates from
   this one block (header, footer, contact page, WhatsApp button/form).
   ===================================================================== */
const SITE = {
  phoneDisplay: '+91 98765 43210',        // phone as shown on the site
  phoneTel:     '+919876543210',          // phone for tel: links (no spaces)
  whatsapp:     '919876543210',           // WhatsApp: country code + number, digits only
  email:        'hello@rocareindia.example',
};

/* The placeholder values baked into the HTML. When you change SITE above,
   every visible occurrence of these is swapped automatically on load. */
const PLACEHOLDERS = {
  phone: '+91 98765 43210',
  email: 'hello@rocareindia.example',
};

(function () {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const nav    = document.querySelector('.main-nav');
  const film   = document.getElementById('film'); // present only on the home page

  /* ---------- Contact details: apply SITE config everywhere ---------- */
  document.querySelectorAll('a[href^="tel:"]').forEach(a => a.setAttribute('href', 'tel:' + SITE.phoneTel));
  document.querySelectorAll('a[href^="mailto:"]').forEach(a => a.setAttribute('href', 'mailto:' + SITE.email));
  if (SITE.phoneDisplay !== PLACEHOLDERS.phone || SITE.email !== PLACEHOLDERS.email) {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.nodeValue.includes(PLACEHOLDERS.phone)) {
        node.nodeValue = node.nodeValue.split(PLACEHOLDERS.phone).join(SITE.phoneDisplay);
      }
      if (node.nodeValue.includes(PLACEHOLDERS.email)) {
        node.nodeValue = node.nodeValue.split(PLACEHOLDERS.email).join(SITE.email);
      }
    }
  }

  /* Floating WhatsApp button (present on every page). */
  const waFloat = document.querySelector('.wa-float');
  if (waFloat) {
    waFloat.href = 'https://wa.me/' + SITE.whatsapp + '?text=' +
      encodeURIComponent('Hi RO Care India! I would like to book an RO service.');
  }

  /* ---------- Header state ---------- */
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

  // Mobile nav toggle. While the menu is open, force the solid header so
  // the logo/toggle stay readable over the video hero.
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      if (open && header) header.classList.add('scrolled');
      else onScroll();
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => { nav.classList.remove('open'); onScroll(); }));
  }

  // Reveal-on-scroll.
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Footer year.
  const yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------- Booking form → WhatsApp ---------- */
  // Builds a pre-filled WhatsApp message from the form and opens the chat,
  // so requests reach the business with zero backend.
  const form = document.getElementById('bookingForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const g = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
      const name = g('bkName') || 'there';

      const lines = [
        'Hi RO Care India! I would like to book a service.',
        `Name: ${g('bkName')}`,
        `Phone: ${g('bkPhone')}`,
        `City/Area: ${g('bkCity')}`,
        g('bkAddress') && `Address: ${g('bkAddress')}`,
        `Service: ${g('bkService')}`,
        g('bkBrand') && `Purifier brand: ${g('bkBrand')}`,
        g('bkNotes') && `Issue: ${g('bkNotes')}`,
      ].filter(Boolean);

      const waUrl = 'https://wa.me/' + SITE.whatsapp + '?text=' + encodeURIComponent(lines.join('\n'));
      form.dataset.waUrl = waUrl; // exposed for testing/debugging
      window.open(waUrl, '_blank', 'noopener');

      const ok = document.getElementById('formSuccess');
      if (ok) {
        ok.textContent = `Thanks, ${name.split(' ')[0]}! We've opened WhatsApp with your request pre-filled — just press send. Our team will call you back to confirm the visit.`;
        ok.classList.add('show');
        ok.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      form.reset();
    });
  }
})();

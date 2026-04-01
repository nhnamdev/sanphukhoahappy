/* ============================================================
   SAN PHU KHOA HAPPY — JAVASCRIPT
   ============================================================ */

'use strict';

/* ─── HERO SLIDER ─────────────────────────────────────────── */
(function () {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.dot');
  const prev   = document.getElementById('slider-prev');
  const next   = document.getElementById('slider-next');
  let current  = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function startAuto() {
    timer = setInterval(() => goTo(current + 1), 6000);
  }

  function resetAuto() { clearInterval(timer); startAuto(); }

  prev && prev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  next && next.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { goTo(i); resetAuto(); });
  });

  startAuto();
})();


/* ─── STICKY HEADER ──────────────────────────────────────── */
(function () {
  const header = document.getElementById('sticky-header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
})();


/* ─── ACTIVE NAV LINK (SCROLL SPY) ─────────────────────── */
(function () {
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => a.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
})();


/* ─── MOBILE MENU ─────────────────────────────────────────── */
(function () {
  const toggle  = document.getElementById('mobile-toggle');
  const close   = document.getElementById('mobile-close');
  const menu    = document.getElementById('mobile-menu');
  const overlay = document.getElementById('mobile-overlay');

  function openMenu()  { menu.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { menu.classList.remove('active'); overlay.classList.remove('active'); document.body.style.overflow = ''; }

  toggle  && toggle.addEventListener('click', openMenu);
  close   && close.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);

  // Close when a mobile nav link is clicked
  document.querySelectorAll('.mobile-nav-links a, .mobile-cta').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
})();


/* ─── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = document.getElementById('main-header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ─── COUNTER ANIMATION ─────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('.counter-num');
  if (!counters.length) return;

  function animateCounter(el) {
    const target  = parseInt(el.getAttribute('data-target'), 10);
    const duration = 2000;
    const step     = Math.ceil(target / (duration / 16));
    let current    = 0;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = current >= 1000
        ? (current >= 1000 ? current.toLocaleString('vi-VN') : current)
        : current;
      if (current < target) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('vi-VN');
    };
    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = '1';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


/* ─── TESTIMONIALS SLIDER ───────────────────────────────── */
(function () {
  const track    = document.getElementById('testimonials-track');
  const prevBtn  = document.getElementById('testi-prev');
  const nextBtn  = document.getElementById('testi-next');
  const dotsWrap = document.getElementById('testi-dots');
  if (!track) return;

  const cards    = track.querySelectorAll('.testimonial-card');
  const total    = cards.length;
  let perPage    = window.innerWidth < 768 ? 1 : 2;
  let current    = 0;
  let autoTimer;

  function buildDots() {
    dotsWrap.innerHTML = '';
    const count = Math.ceil(total / perPage);
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'testi-dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { goTo(i); resetAuto(); });
      dotsWrap.appendChild(dot);
    }
  }

  function updateDots() {
    document.querySelectorAll('.testi-dot').forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  function goTo(index) {
    const maxPage = Math.ceil(total / perPage) - 1;
    current = Math.max(0, Math.min(index, maxPage));
    const cardW = cards[0].offsetWidth + 24; // gap
    track.style.transform = `translateX(-${current * perPage * cardW}px)`;
    updateDots();
  }

  function startAuto() { autoTimer = setInterval(() => goTo(current + 1 > Math.ceil(total / perPage) - 1 ? 0 : current + 1), 5000); }
  function resetAuto()  { clearInterval(autoTimer); startAuto(); }

  prevBtn && prevBtn.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  nextBtn && nextBtn.addEventListener('click', () => { goTo(current + 1 > Math.ceil(total / perPage) - 1 ? 0 : current + 1); resetAuto(); });

  window.addEventListener('resize', () => {
    perPage = window.innerWidth < 768 ? 1 : 2;
    buildDots();
    goTo(0);
  });

  buildDots();
  startAuto();
})();


/* ─── BACK TO TOP ───────────────────────────────────────── */
(function () {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();


/* ─── APPOINTMENT FORM ──────────────────────────────────── */
(function () {
  const form    = document.getElementById('appointment-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('form-submit-btn');
  if (!form) return;

  // Set min date to today
  const dateInput = document.getElementById('appointment-date');
  if (dateInput) {
    const today = new Date();
    const yyyy  = today.getFullYear();
    const mm    = String(today.getMonth() + 1).padStart(2, '0');
    const dd    = String(today.getDate()).padStart(2, '0');
    dateInput.min = `${yyyy}-${mm}-${dd}`;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Basic validation
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#f43f5e';
        valid = false;
        field.addEventListener('input', () => field.style.borderColor = '', { once: true });
      }
    });

    if (!valid) return;

    // Simulate submission
    const btnText = submitBtn.querySelector('.btn-text');
    btnText.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    setTimeout(() => {
      success.classList.add('show');
      form.reset();
      btnText.textContent = 'Đặt lịch hẹn';
      submitBtn.disabled = false;
      setTimeout(() => success.classList.remove('show'), 6000);
    }, 1200);
  });
})();


/* ─── SCROLL REVEAL (SIMPLE) ────────────────────────────── */
(function () {
  const elements = document.querySelectorAll(
    '.service-card, .blog-card, .doctor-card, .testimonial-card, .contact-item, .counter-item'
  );

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity .5s ease, transform .5s ease';
    observer.observe(el);
  });
})();

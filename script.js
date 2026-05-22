/* ============================================================
   SAN PHU KHOA HAPPY — JAVASCRIPT
   ============================================================ */

'use strict';

/* DOCTOR SCHEDULE FROM SUPABASE */
(async function () {
  const supabaseFactory = window.supabase;
  if (!supabaseFactory || !supabaseFactory.createClient) return;

  const scheduleCells = document.querySelectorAll('[data-schedule-day]');
  if (!scheduleCells.length) return;

  const supabaseUrl = 'https://jbowxpffvkoykhjgieop.supabase.co';
  const supabaseKey = 'sb_publishable_j_oEIq8bP-s7NrHeMLfXiw_MTfCliLB';
  const client = supabaseFactory.createClient(supabaseUrl, supabaseKey);

  const { data, error } = await client
    .from('doctor_work_schedules')
    .select('day_key, day_label, schedule_text')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });

  if (error || !Array.isArray(data)) {
    console.warn('Could not load doctor schedule from Supabase.', error);
    return;
  }

  data.forEach(item => {
    const cell = document.querySelector(`[data-schedule-day="${item.day_key}"]`);
    if (cell && item.schedule_text) cell.textContent = item.schedule_text;

    const heading = document.querySelector(`[data-schedule-label="${item.day_key}"]`);
    if (heading && item.day_label) heading.textContent = item.day_label;
  });
})();

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
  const servicesToggle = document.querySelector('[data-mobile-services-toggle]');
  const servicesItem = servicesToggle ? servicesToggle.closest('.mobile-services-item') : null;

  function openMenu()  { menu.classList.add('active'); overlay.classList.add('active'); document.body.style.overflow = 'hidden'; }
  function closeMenu() {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    if (servicesItem && servicesToggle) {
      servicesItem.classList.remove('is-open');
      servicesToggle.setAttribute('aria-expanded', 'false');
    }
  }

  toggle  && toggle.addEventListener('click', openMenu);
  close   && close.addEventListener('click', closeMenu);
  overlay && overlay.addEventListener('click', closeMenu);
  servicesToggle && servicesToggle.addEventListener('click', () => {
    const isOpen = servicesItem.classList.toggle('is-open');
    servicesToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  // Close when a mobile nav link is clicked
  document.querySelectorAll('.mobile-nav-links a, .mobile-cta').forEach(a => {
    a.addEventListener('click', closeMenu);
  });
})();


/* ─── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.hasAttribute('data-service-detail-link') || this.hasAttribute('data-profile-detail-link') || this.hasAttribute('data-article-detail-link')) return;
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const headerH = document.getElementById('main-header').offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* SERVICE DETAIL */
(function () {
  const triggers = document.querySelectorAll('[data-service-detail-link], [data-profile-detail-link], [data-article-detail-link]');
  let lastFocusedElement = null;
  if (!triggers.length) return;

  function getModalFromTrigger(trigger) {
    const targetId = trigger.dataset.modalTarget || trigger.getAttribute('href');
    return targetId ? document.querySelector(targetId) : null;
  }

  function openModal(modal, event) {
    const dialog = modal ? modal.querySelector('.service-modal-dialog') : null;
    if (!modal || !dialog) return;
    if (event) event.preventDefault();
    lastFocusedElement = document.activeElement;
    closeOpenModal();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    dialog.focus();
  }

  function closeOpenModal() {
    const modal = document.querySelector('.service-modal.is-open');
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (window.location.hash === `#${modal.id}`) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }

  triggers.forEach(trigger => {
    trigger.addEventListener('click', event => {
      openModal(getModalFromTrigger(trigger), event);
    });
  });

  document.querySelectorAll('[data-service-modal-close]').forEach(button => {
    button.addEventListener('click', () => {
      closeOpenModal();
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus();
      }
    });
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.querySelector('.service-modal.is-open')) {
      closeOpenModal();
      if (lastFocusedElement && lastFocusedElement.focus) {
        lastFocusedElement.focus();
      }
    }
  });

  if (window.location.hash) {
    const modal = document.querySelector(window.location.hash);
    if (modal && modal.classList.contains('service-modal')) {
      openModal(modal);
    }
  }
})();


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

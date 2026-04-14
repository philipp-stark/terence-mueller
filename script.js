/* ═══════════════════════════════════════════════
   TERENCE MÜLLER – Scripts
═══════════════════════════════════════════════ */

// ── Navbar scroll behavior ──
const navbar = document.getElementById('navbar');
const onScroll = () => {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ── Mobile burger menu ──
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

const closeMenu = () => {
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
  burger.setAttribute('aria-expanded', 'false');
  burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
};

burger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  const isOpen = mobileMenu.classList.contains('open');
  burger.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  // Animate burger to X
  const spans = burger.querySelectorAll('span');
  if (isOpen) {
    spans[0].style.transform = 'translateY(7px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-7px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

mobileLinks.forEach(link => {
  if (!link.classList.contains('mobile-link--parent')) {
    link.addEventListener('click', closeMenu);
  }
});

// Accordion toggle for Finanzierung
document.querySelectorAll('.mobile-link--parent').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const group = link.closest('.nav__mobile-group');
    group.classList.toggle('open');
  });
});

// ── Scroll reveal ──
const revealEls = document.querySelectorAll(
  '.section-header, .service-card, .about__image-wrap, .about__content, ' +
  '.stats__item, .contact__info, .contact__form-wrap, .service-cta__content'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = Array.from(entry.target.parentElement.querySelectorAll('.reveal'));
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

// ── Flip card: auto-reset on scroll ──
const flipCard = document.querySelector('.flip-card');
if (flipCard) {
  flipCard.addEventListener('click', () => {
    flipCard.classList.toggle('flipped');
  });

  window.addEventListener('scroll', () => {
    if (flipCard.classList.contains('flipped')) {
      const rect = flipCard.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        flipCard.classList.remove('flipped');
      }
    }
  }, { passive: true });
}

// ── Counter animation (stats) ──
const counters = document.querySelectorAll('.stats__number');

const animateCounter = (el) => {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counters.forEach(c => counterObserver.observe(c));

// ── Smooth scroll for anchor links ──
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── Contact form ──
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Wird gesendet…';
    btn.disabled = true;
    btn.style.opacity = '.7';

    // Simulate (replace with real endpoint)
    await new Promise(r => setTimeout(r, 1400));

    btn.textContent = 'Nachricht gesendet ✓';
    btn.style.background = '#2d9a6b';
    btn.style.opacity = '1';

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.background = '';
      form.reset();
    }, 3500);
  });
}

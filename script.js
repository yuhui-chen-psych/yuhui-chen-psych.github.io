/* ══════════════════════════════════════════════
   YUHUI CHEN — ACADEMIC WEBSITE
   script.js
══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── Elements ──────────────────────────────── */
  const nav        = document.getElementById('nav');
  const navToggle  = document.getElementById('navToggle');
  const navLinks   = document.getElementById('navLinks');
  const backToTop  = document.getElementById('backToTop');

  /* ══════════════════════════════════════════
     NAVIGATION — scroll styling & active links
  ══════════════════════════════════════════ */
  function onScroll() {
    const y = window.scrollY;

    // Frosted nav on scroll
    nav.classList.toggle('scrolled', y > 20);

    // Back-to-top button
    backToTop.classList.toggle('visible', y > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  /* Active nav link via IntersectionObserver */
  const sections   = document.querySelectorAll('section[id], footer[id]');
  const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

  function setActive(id) {
    navAnchors.forEach(a => {
      const href = a.getAttribute('href');
      a.classList.toggle('active', href === '#' + id);
    });
  }

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    {
      rootMargin: `-${62}px 0px -55% 0px`,
      threshold: 0,
    }
  );

  sections.forEach(s => sectionObserver.observe(s));

  /* ══════════════════════════════════════════
     MOBILE MENU
  ══════════════════════════════════════════ */
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target)) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });

  /* ══════════════════════════════════════════
     BACK TO TOP
  ══════════════════════════════════════════ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ══════════════════════════════════════════
     SCROLL-REVEAL ANIMATIONS
     Adds 'visible' class when element enters viewport
  ══════════════════════════════════════════ */
  const revealEls = document.querySelectorAll(
    '.interest-card, .pub-card, .timeline__item, .talk-item, .teaching-card, .award-item'
  );

  // Stagger children within each group
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Small stagger delay based on sibling index
          const siblings = Array.from(entry.target.parentElement.children);
          const idx      = siblings.indexOf(entry.target);
          entry.target.style.transitionDelay = `${idx * 60}ms`;
          entry.target.classList.add('reveal', 'visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  /* ══════════════════════════════════════════
     PUBLICATION RESULTS TOGGLE
  ══════════════════════════════════════════ */
  window.toggleResults = function (btn) {
    const body   = btn.closest('.pub-card__body');
    const panel  = body.querySelector('.pub-results');
    if (!panel) return;

    const isHidden = panel.hasAttribute('hidden');

    if (isHidden) {
      panel.removeAttribute('hidden');
      btn.innerHTML = 'Results / Images ▴';
      btn.setAttribute('aria-expanded', 'true');

      // Smooth height animation
      panel.style.overflow = 'hidden';
      panel.style.maxHeight = '0';
      panel.style.opacity   = '0';
      panel.style.transition = 'max-height 0.35s ease, opacity 0.3s ease';

      requestAnimationFrame(() => {
        panel.style.maxHeight = panel.scrollHeight + 'px';
        panel.style.opacity   = '1';
      });

      // Clean up inline styles after animation
      panel.addEventListener('transitionend', () => {
        panel.style.maxHeight = '';
        panel.style.overflow  = '';
        panel.style.transition = '';
        panel.style.opacity   = '';
      }, { once: true });

    } else {
      // Collapse
      panel.style.maxHeight  = panel.scrollHeight + 'px';
      panel.style.overflow   = 'hidden';
      panel.style.opacity    = '1';
      panel.style.transition = 'max-height 0.3s ease, opacity 0.25s ease';

      requestAnimationFrame(() => {
        panel.style.maxHeight = '0';
        panel.style.opacity   = '0';
      });

      panel.addEventListener('transitionend', () => {
        panel.setAttribute('hidden', '');
        panel.style.maxHeight  = '';
        panel.style.overflow   = '';
        panel.style.transition = '';
        panel.style.opacity    = '';
        btn.innerHTML = 'Results / Images ▾';
        btn.setAttribute('aria-expanded', 'false');
      }, { once: true });
    }
  };

  /* ══════════════════════════════════════════
     KEYBOARD ACCESSIBILITY
     Allow Escape to close mobile menu
  ══════════════════════════════════════════ */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.focus();
    }
  });

  /* Initial call */
  onScroll();

})();

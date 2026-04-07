/* ============================================================
   ANIRUDDHA AJAGEKAR — Portfolio JavaScript
   Modules:
   1. Custom cursor
   2. Navbar (scroll glass, active link, hamburger)
   3. Theme toggle (dark / light)
   4. Typing animation
   5. Hero particle canvas
   6. Scroll reveal
   7. Skill bar animation
   8. Contact form validation
   9. Back-to-top button
   10. Smooth anchor scroll
   ============================================================ */

/* ─── 1. CUSTOM CURSOR ──────────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0; // mouse position
  let rx = 0, ry = 0; // ring position (lerped)

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    // Dot follows instantly
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  // Ring follows with smooth lag (requestAnimationFrame lerp)
  function animateRing() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity = ring.style.opacity = '1';
  });
})();


/* ─── 2. NAVBAR ─────────────────────────────────────────────── */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const burger    = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const mobLinks  = document.querySelectorAll('.mob-link');

  /* Add glass effect after scrolling 40px */
  function onScroll() {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    highlightActiveLink();
  }

  /* Highlight the link whose section is in view */
  function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';

    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 90) {
        current = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // initial run

  /* Hamburger toggle */
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('open');
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  });

  /* Close drawer on mobile link click */
  mobLinks.forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('open');
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ─── 3. THEME TOGGLE ───────────────────────────────────────── */
(function initTheme() {
  const btn  = document.getElementById('themeBtn');
  const html = document.documentElement;

  // Read saved preference
  const saved = localStorage.getItem('theme') || 'dark';
  html.setAttribute('data-theme', saved);

  btn.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
})();


/* ─── 4. TYPING ANIMATION ───────────────────────────────────── */
(function initTyping() {
  const el     = document.getElementById('typed');
  if (!el) return;

  const words  = ['Web Developer', 'Frontend Developer', 'Java Programmer'];
  let wi       = 0;  // word index
  let ci       = 0;  // char index
  let deleting = false;

  function tick() {
    const word    = words[wi];
    el.textContent = word.slice(0, ci);

    if (!deleting) {
      ci++;
      if (ci > word.length) {
        // Pause at end of word before deleting
        deleting = true;
        setTimeout(tick, 1700);
        return;
      }
    } else {
      ci--;
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(tick, 350);
        return;
      }
    }

    setTimeout(tick, deleting ? 52 : 88);
  }

  setTimeout(tick, 800); // initial delay before start
})();


/* ─── 5. HERO PARTICLE CANVAS ───────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles;

  /* Resize canvas to full viewport */
  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  /* Particle constructor */
  function makeParticle() {
    return {
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.15
    };
  }

  function initParticles() {
    // Fewer particles on mobile for performance
    const count = window.innerWidth < 768 ? 55 : 120;
    particles = Array.from({ length: count }, makeParticle);
  }

  function drawLines() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(56,189,248,${0.12 * (1 - dist / maxDist)})`;
          ctx.lineWidth   = 0.6;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Bounce off edges
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.alpha})`;
      ctx.fill();
    });

    drawLines();
    requestAnimationFrame(animate);
  }

  resize();
  initParticles();
  animate();

  window.addEventListener('resize', () => {
    resize();
    initParticles();
  });
})();


/* ─── 6. SCROLL REVEAL ──────────────────────────────────────── */
(function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        // Stagger siblings for a cascade effect
        const parent   = entry.target.parentElement;
        const siblings = Array.from(parent.querySelectorAll('.reveal:not(.visible)'));
        const idx      = siblings.indexOf(entry.target);

        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 90);

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -36px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();


/* ─── 7. SKILL BAR ANIMATION ────────────────────────────────── */
(function initSkillBars() {
  const rows = document.querySelectorAll('.skill-row');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const fill = entry.target.querySelector('.bar-fill');
        const pct  = entry.target.getAttribute('data-pct');
        if (fill && pct) {
          fill.style.width = pct + '%';
        }
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.35 }
  );

  rows.forEach(row => observer.observe(row));
})();


/* ─── 8. CONTACT FORM VALIDATION ────────────────────────────── */
(function initContactForm() {
  const form       = document.getElementById('contactForm');
  if (!form) return;

  const nameIn     = document.getElementById('cfName');
  const emailIn    = document.getElementById('cfEmail');
  const msgIn      = document.getElementById('cfMsg');
  const errName    = document.getElementById('errName');
  const errEmail   = document.getElementById('errEmail');
  const errMsg     = document.getElementById('errMsg');
  const successBox = document.getElementById('formSuccess');
  const emailRx    = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* Clear individual error on input */
  nameIn.addEventListener('input',  () => { errName.textContent  = ''; });
  emailIn.addEventListener('input', () => { errEmail.textContent = ''; });
  msgIn.addEventListener('input',   () => { errMsg.textContent   = ''; });

  function validate() {
    let ok = true;

    if (nameIn.value.trim().length < 2) {
      errName.textContent = 'Please enter your name (min 2 characters).';
      ok = false;
    }
    if (!emailRx.test(emailIn.value.trim())) {
      errEmail.textContent = 'Please enter a valid email address.';
      ok = false;
    }
    if (msgIn.value.trim().length < 10) {
      errMsg.textContent = 'Message must be at least 10 characters.';
      ok = false;
    }

    return ok;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validate()) return;

    const btn       = form.querySelector('button[type="submit"]');
    btn.disabled    = true;
    btn.innerHTML   = '<i class="bx bx-loader-alt bx-spin"></i> Sending…';

    // Simulate async send (replace with real fetch in production)
    setTimeout(() => {
      btn.disabled  = false;
      btn.innerHTML = '<i class="bx bx-send"></i> Send Message';
      form.reset();
      successBox.classList.add('show');
      setTimeout(() => successBox.classList.remove('show'), 5000);
    }, 1800);
  });
})();


/* ─── 9. BACK TO TOP ────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('backTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();


/* ─── 10. SMOOTH ANCHOR SCROLL (with navbar offset) ─────────── */
(function initSmoothScroll() {
  const NAV = 66; // match --nav-h in CSS

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id  = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - NAV;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

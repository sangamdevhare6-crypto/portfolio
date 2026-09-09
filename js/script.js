/* ═══════════════════════════════════════════════════════════════
   SANGAM DEVHARE PORTFOLIO – MAIN SCRIPT
   Futuristic AI/ML Developer Interface
   ═══════════════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────────
   1. BOOT LOADER / STARTUP ANIMATION
───────────────────────────────────────────── */
(function bootSequence() {
  const loader   = document.getElementById('boot-loader');
  const bar      = document.getElementById('boot-bar');
  const log      = document.getElementById('boot-log');
  const percent  = document.getElementById('boot-percent');

  const steps = [
    { text: 'INITIALIZING SYSTEM...', p: 15 },
    { text: 'LOADING PROFILE...', p: 35 },
    { text: 'LOADING SKILLS...', p: 55 },
    { text: 'LOADING PROJECTS...', p: 75 },
    { text: 'CALIBRATING INTERFACE...', p: 90 },
    { text: 'SYSTEM READY ✓', p: 100 },
  ];

  document.body.classList.add('loading');
  let i = 0;

  function runStep() {
    if (i >= steps.length) return;
    const step = steps[i];

    // Mark previous as done
    const prev = log.querySelector('.active');
    if (prev) { prev.classList.remove('active'); prev.classList.add('done'); }

    // Add new line
    const line = document.createElement('div');
    line.className = 'boot-line active';
    line.textContent = step.text;
    log.appendChild(line);

    // Update bar and percent
    bar.style.width = step.p + '%';
    animatePercent(+percent.textContent.replace('%',''), step.p, percent);

    i++;
    if (i < steps.length) {
      setTimeout(runStep, 480);
    } else {
      // Finish
      setTimeout(() => {
        loader.classList.add('fade-out');
        document.body.classList.remove('loading');
        setTimeout(() => { loader.style.display = 'none'; initPortfolio(); }, 800);
      }, 600);
    }
  }

  function animatePercent(from, to, el) {
    const dur = 400, start = performance.now();
    function tick(now) {
      const t = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(from + (to - from) * t) + '%';
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  setTimeout(runStep, 400);
})();

/* ─────────────────────────────────────────────
   2. INIT EVERYTHING AFTER BOOT
───────────────────────────────────────────── */
function initPortfolio() {
  initParticles();
  initCustomCursor();
  initNavbar();
  initHamburger();
  initHeroRoleMorph();
  initScrollAnimations();
  initTiltCards();
  initSkillSpotlight();
  initProjectSpotlight();
  initSkillRadials();
  initStatCounters();
  initContactForm();
  initAIAssistant();
  initMagneticButtons();
  initParallax();
  initActiveNav();
}

/* ─────────────────────────────────────────────
   3. PARTICLE SYSTEM
───────────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];
  let mouse = { x: -9999, y: -9999 };

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); createParticles(); });

  function Particle() {
    this.reset = function() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.4;
      const palette = ['rgba(0,245,255,', 'rgba(0,102,255,', 'rgba(217,70,239,', 'rgba(124,58,237,'];
      this.color = palette[Math.floor(Math.random() * palette.length)];
      this.alpha = Math.random() * 0.5 + 0.1;
      this.life  = 0;
      this.maxLife = Math.random() * 400 + 200;
    };
    this.reset();
  }

  function createParticles() {
    const count = Math.floor((W * H) / 12000);
    particles = Array.from({ length: count }, () => new Particle());
  }
  createParticles();

  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, idx) => {
      p.x  += p.vx;
      p.y  += p.vy;
      p.life++;

      // Mouse repel
      const dx = p.x - mouse.x, dy = p.y - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 100) {
        const force = (100 - dist) / 100;
        p.vx += (dx / dist) * force * 0.3;
        p.vy += (dy / dist) * force * 0.3;
      }

      // Speed limit
      const speed = Math.hypot(p.vx, p.vy);
      if (speed > 1.5) { p.vx *= 0.95; p.vy *= 0.95; }

      // Fade life
      const lifeFrac = p.life / p.maxLife;
      const fade = lifeFrac < 0.1 ? lifeFrac / 0.1 : lifeFrac > 0.9 ? (1 - lifeFrac) / 0.1 : 1;
      const alpha = p.alpha * fade;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      // Connect nearby particles
      for (let j = idx + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(0,245,255,${(1 - d / 90) * 0.06})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // Wrap or reset
      if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10 || p.life > p.maxLife) {
        p.reset();
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ─────────────────────────────────────────────
   4. CUSTOM CURSOR
───────────────────────────────────────────── */
function initCustomCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');
  if (!dot) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
    glow.style.left = mx + 'px';
    glow.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  // Hover state for interactive elements
  const hoverEls = document.querySelectorAll('a, button, .magnetic-btn, .skill-card, .project-card, .cert-card, .ai-option');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ─────────────────────────────────────────────
   5. NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   6. HAMBURGER MENU
───────────────────────────────────────────── */
function initHamburger() {
  const ham     = document.getElementById('hamburger');
  const links   = document.getElementById('nav-links');
  const overlay = document.getElementById('mobile-overlay');

  function close() {
    ham.classList.remove('open');
    links.classList.remove('open');
    overlay.classList.remove('active');
  }

  ham.addEventListener('click', () => {
    ham.classList.toggle('open');
    links.classList.toggle('open');
    overlay.classList.toggle('active');
  });

  overlay.addEventListener('click', close);
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', close));
}

/* ─────────────────────────────────────────────
   7. HERO ROLE MORPH (TYPEWRITER)
───────────────────────────────────────────── */
function initHeroRoleMorph() {
  const el    = document.getElementById('hero-role');
  if (!el) return;
  const roles = ['AI/ML Developer', 'Web Developer', 'Problem Solver', 'Tech Enthusiast'];
  let ri = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 80, SPEED_DEL = 45, PAUSE = 2000;

  function type() {
    const current = roles[ri];
    if (!deleting) {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(type, PAUSE); return; }
    } else {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(type, 500);
}

/* ─────────────────────────────────────────────
   8. SCROLL ANIMATIONS (AOS-LITE)
───────────────────────────────────────────── */
function initScrollAnimations() {
  const els = document.querySelectorAll('[data-aos]');
  const delays = {};
  els.forEach(el => {
    delays[el] = +(el.dataset.aosDelay || 0);
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        setTimeout(() => el.classList.add('aos-animate'), delays[el] || 0);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   9. 3D TILT CARDS
───────────────────────────────────────────── */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r   = card.getBoundingClientRect();
      const cx  = r.left + r.width / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = e.clientX - cx;
      const dy  = e.clientY - cy;
      const rx  = (dy / r.height) * -16;
      const ry  = (dx / r.width)  *  16;
      card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;
      card.style.transition = 'transform 0.1s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
  });
}

/* ─────────────────────────────────────────────
   10. SKILL CARD SPOTLIGHT
───────────────────────────────────────────── */
function initSkillSpotlight() {
  document.querySelectorAll('.skill-card').forEach(card => {
    const spot = card.querySelector('.skill-spotlight');
    if (!spot) return;
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width)  * 100;
      const y  = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ─────────────────────────────────────────────
   11. PROJECT CARD SPOTLIGHT
───────────────────────────────────────────── */
function initProjectSpotlight() {
  document.querySelectorAll('.project-card').forEach(card => {
    const spot = card.querySelector('.project-spotlight');
    if (!spot) return;
    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width)  * 100;
      const y  = ((e.clientY - r.top)  / r.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ─────────────────────────────────────────────
   12. SKILL CIRCULAR PROGRESS
───────────────────────────────────────────── */
function initSkillRadials() {
  // Inject SVG gradient def
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', '0');
  svg.setAttribute('height', '0');
  svg.style.position = 'absolute';
  svg.innerHTML = `
    <defs>
      <linearGradient id="skillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00f5ff"/>
        <stop offset="50%" stop-color="#0066ff"/>
        <stop offset="100%" stop-color="#d946ef"/>
      </linearGradient>
    </defs>`;
  document.body.appendChild(svg);

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const prog = entry.target.querySelector('.svg-progress');
      if (!prog) return;
      const pct    = +(prog.dataset.percent || 0);
      const circum = 2 * Math.PI * 50; // r=50
      const offset = circum * (1 - pct / 100);
      prog.style.strokeDasharray  = circum;
      prog.style.strokeDashoffset = circum;
      requestAnimationFrame(() => {
        setTimeout(() => { prog.style.strokeDashoffset = offset; }, 50);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-card').forEach(el => obs.observe(el));
}

/* ─────────────────────────────────────────────
   13. STAT NUMBER COUNTERS
───────────────────────────────────────────── */
function initStatCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      animateCount(el, 0, target, 1600, suffix);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-number').forEach(el => obs.observe(el));

  function animateCount(el, from, to, dur, suffix) {
    const start = performance.now();
    function tick(now) {
      const t  = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(from + (to - from) * ease) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
}

/* ─────────────────────────────────────────────
   14. CONTACT FORM – EMAILJS
───────────────────────────────────────────── */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submit = document.getElementById('form-submit');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('form-name');
    const email = document.getElementById('form-email');
    const msg = document.getElementById('form-message');

    let valid = true;

    /* Validate fields */
    [name, email, msg].forEach(field => {
      if (!field.value.trim()) {
        field.style.borderColor = '#f87171';
        valid = false;

        setTimeout(() => {
          field.style.borderColor = '';
        }, 2000);
      }
    });

    /* Validate email */
    if (
      email.value.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())
    ) {
      email.style.borderColor = '#f87171';
      valid = false;

      setTimeout(() => {
        email.style.borderColor = '';
      }, 2000);
    }

    if (!valid) return;

    /* Loading state */
    submit.innerHTML =
      '<span>Sending...</span><span class="btn-arrow">⏳</span>';

    submit.disabled = true;

    try {
      /* Send message using EmailJS */
      const response = await emailjs.sendForm(
        'service_jw05ddu',
        'template_jwzkzye',
        form
      );

      console.log('EmailJS Success:', response.status, response.text);

      /* Success state */
      submit.innerHTML =
        '<span>Sent!</span><span class="btn-arrow">✓</span>';

      success.innerHTML =
        '<span>✓</span> Your message was sent successfully!';

      success.style.display = 'block';

      /* Clear form */
      form.reset();

      /* Reset button after 4 seconds */
      setTimeout(() => {
        submit.innerHTML =
          '<span>Send Message</span><span class="btn-arrow">✈</span>';

        submit.disabled = false;
        success.style.display = 'none';
      }, 4000);

    } catch (error) {

      console.error('EmailJS Error:', error);

      /* Error state */
      submit.innerHTML =
        '<span>Failed</span><span class="btn-arrow">✕</span>';

      success.innerHTML =
        '<span>!</span> Message could not be sent. Please try again.';

      success.style.display = 'block';

      /* Reset button */
      setTimeout(() => {
        submit.innerHTML =
          '<span>Send Message</span><span class="btn-arrow">✈</span>';

        submit.disabled = false;
        success.style.display = 'none';
      }, 4000);
    }
  });
}

/* ─────────────────────────────────────────────
   15. AI ASSISTANT
───────────────────────────────────────────── */
function initAIAssistant() {
  const fab     = document.getElementById('ai-fab');
  const panel   = document.getElementById('ai-panel');
  const closeBtn= document.getElementById('ai-close');

  fab.addEventListener('click', () => panel.classList.toggle('open'));
  closeBtn.addEventListener('click', () => panel.classList.remove('open'));

  document.querySelectorAll('.ai-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;
      panel.classList.remove('open');
      const section = document.getElementById(target);
      if (section) {
        setTimeout(() => {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 200);
      }
    });
  });
}

/* ─────────────────────────────────────────────
   16. MAGNETIC BUTTONS
───────────────────────────────────────────── */
function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r  = btn.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.3;
      const dy = (e.clientY - cy) * 0.3;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
      btn.style.transition = 'transform 0.1s ease';
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.4s ease';
    });
  });
}

/* ─────────────────────────────────────────────
   17. PARALLAX BACKGROUND
───────────────────────────────────────────── */
function initParallax() {
  const grid = document.querySelector('.hero-bg-grid');
  if (!grid) return;

  window.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    grid.style.transform = `translate(${x}px, ${y}px)`;
  }, { passive: true });
}

/* ─────────────────────────────────────────────
   18. ACTIVE NAV HIGHLIGHT ON SCROLL
───────────────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[data-section]');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => {
          l.classList.toggle('active', l.dataset.section === entry.target.id);
        });
      }
    });
  }, { threshold: 0.35, rootMargin: '-70px 0px -70px 0px' });

  sections.forEach(s => obs.observe(s));

  // Smooth scroll for all nav links
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ─────────────────────────────────────────────
   19. HOLOGRAPHIC FRAME MOUSE PARALLAX
───────────────────────────────────────────── */
(function holoParallax() {
  const holo = document.querySelector('.holo-frame');
  if (!holo) return;

  window.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;
    holo.style.transform = `rotateY(${dx * 10}deg) rotateX(${-dy * 6}deg)`;
    holo.style.transition = 'transform 0.3s ease';
  }, { passive: true });
  window.addEventListener('mouseleave', () => {
    holo.style.transform = '';
  });
})();

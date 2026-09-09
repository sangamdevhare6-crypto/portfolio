/* ═══════════════════════════════════════════════════════════════
   SANGAM DEVHARE PORTFOLIO – MAIN SCRIPT
   Futuristic AI/ML Developer Interface
   ═══════════════════════════════════════════════════════════════ */

'use strict';


/* ─────────────────────────────────────────────
   1. BOOT LOADER / STARTUP ANIMATION
───────────────────────────────────────────── */

(function bootSequence() {

  const loader  = document.getElementById('boot-loader');
  const bar     = document.getElementById('boot-bar');
  const log     = document.getElementById('boot-log');
  const percent = document.getElementById('boot-percent');

  const steps = [
    { text: 'INITIALIZING SYSTEM...', p: 15 },
    { text: 'LOADING PROFILE...', p: 35 },
    { text: 'LOADING SKILLS...', p: 55 },
    { text: 'LOADING PROJECTS...', p: 75 },
    { text: 'CALIBRATING INTERFACE...', p: 90 },
    { text: 'SYSTEM READY ✓', p: 100 }
  ];

  document.body.classList.add('loading');

  let i = 0;

  function runStep() {

    if (i >= steps.length) return;

    const step = steps[i];

    const prev = log.querySelector('.active');

    if (prev) {
      prev.classList.remove('active');
      prev.classList.add('done');
    }

    const line = document.createElement('div');

    line.className = 'boot-line active';
    line.textContent = step.text;

    log.appendChild(line);

    bar.style.width = step.p + '%';

    animatePercent(
      +percent.textContent.replace('%', ''),
      step.p,
      percent
    );

    i++;

    if (i < steps.length) {

      setTimeout(runStep, 480);

    } else {

      setTimeout(() => {

        loader.classList.add('fade-out');

        document.body.classList.remove('loading');

        setTimeout(() => {

          loader.style.display = 'none';

          initPortfolio();

        }, 800);

      }, 600);
    }
  }


  function animatePercent(from, to, el) {

    const dur = 400;
    const start = performance.now();

    function tick(now) {

      const t = Math.min(
        (now - start) / dur,
        1
      );

      el.textContent =
        Math.round(
          from + (to - from) * t
        ) + '%';

      if (t < 1) {
        requestAnimationFrame(tick);
      }
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

  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let W;
  let H;

  let particles = [];

  let mouse = {
    x: -9999,
    y: -9999
  };


  function resize() {

    W = canvas.width = window.innerWidth;

    H = canvas.height = window.innerHeight;

  }


  resize();


  window.addEventListener(
    'resize',
    () => {

      resize();

      createParticles();

    }
  );


  function Particle() {

    this.reset = function() {

      this.x =
        Math.random() * W;

      this.y =
        Math.random() * H;

      this.vx =
        (Math.random() - 0.5) * 0.4;

      this.vy =
        (Math.random() - 0.5) * 0.4;

      this.r =
        Math.random() * 1.8 + 0.4;


      const palette = [
        'rgba(0,245,255,',
        'rgba(0,102,255,',
        'rgba(217,70,239,',
        'rgba(124,58,237,'
      ];


      this.color =
        palette[
          Math.floor(
            Math.random() * palette.length
          )
        ];


      this.alpha =
        Math.random() * 0.5 + 0.1;

      this.life = 0;

      this.maxLife =
        Math.random() * 400 + 200;

    };


    this.reset();

  }


  function createParticles() {

    const count =
      Math.floor(
        (W * H) / 12000
      );

    particles =
      Array.from(
        { length: count },
        () => new Particle()
      );

  }


  createParticles();


  window.addEventListener(
    'mousemove',
    e => {

      mouse.x = e.clientX;

      mouse.y = e.clientY;

    }
  );


  function draw() {

    ctx.clearRect(
      0,
      0,
      W,
      H
    );


    particles.forEach(
      (p, idx) => {

        p.x += p.vx;

        p.y += p.vy;

        p.life++;


        /* Mouse repel */

        const dx =
          p.x - mouse.x;

        const dy =
          p.y - mouse.y;

        const dist =
          Math.hypot(dx, dy);


        if (dist < 100 && dist > 0) {

          const force =
            (100 - dist) / 100;

          p.vx +=
            (dx / dist) *
            force *
            0.3;

          p.vy +=
            (dy / dist) *
            force *
            0.3;

        }


        /* Speed limit */

        const speed =
          Math.hypot(
            p.vx,
            p.vy
          );


        if (speed > 1.5) {

          p.vx *= 0.95;

          p.vy *= 0.95;

        }


        /* Fade */

        const lifeFrac =
          p.life / p.maxLife;


        const fade =
          lifeFrac < 0.1
            ? lifeFrac / 0.1
            : lifeFrac > 0.9
              ? (1 - lifeFrac) / 0.1
              : 1;


        const alpha =
          p.alpha * fade;


        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          p.r,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          p.color + alpha + ')';

        ctx.fill();


        /* Connect particles */

        for (
          let j = idx + 1;
          j < particles.length;
          j++
        ) {

          const q =
            particles[j];


          const d =
            Math.hypot(
              p.x - q.x,
              p.y - q.y
            );


          if (d < 90) {

            ctx.beginPath();

            ctx.moveTo(
              p.x,
              p.y
            );

            ctx.lineTo(
              q.x,
              q.y
            );


            ctx.strokeStyle =
              `rgba(0,245,255,${
                (1 - d / 90) * 0.06
              })`;

            ctx.lineWidth = 0.5;

            ctx.stroke();

          }

        }


        /* Reset */

        if (
          p.x < -10 ||
          p.x > W + 10 ||
          p.y < -10 ||
          p.y > H + 10 ||
          p.life > p.maxLife
        ) {

          p.reset();

        }

      }
    );


    requestAnimationFrame(draw);

  }


  draw();

}

/* ═══════════════════════════════════════════════════════════════
   4. 🐍 NEON SNAKE + ORIGINAL CURSOR + CLICK EXPLOSION
═══════════════════════════════════════════════════════════════ */

function initCustomCursor() {

  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  const glow = document.getElementById('cursor-glow');

  if (!dot || !ring || !glow) return;


  /* =========================================
     CURSOR POSITION
  ========================================= */

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;

  let rx = mx;
  let ry = my;


  /* =========================================
     SNAKE SETTINGS
  ========================================= */

  const snakeCount = 20;
  const snake = [];

  let pointerActive = false;
  let exploding = false;

  let explosionX = mx;
  let explosionY = my;


  /* =========================================
     CREATE SNAKE
  ========================================= */

  for (let i = 0; i < snakeCount; i++) {

    const segment = document.createElement('div');

    segment.className = 'snake-segment';

    if (i >= snakeCount - 5) {
      segment.classList.add('tail');
    }

    segment.style.left = mx + 'px';
    segment.style.top = my + 'px';

    document.body.appendChild(segment);

    snake.push({
      el: segment,
      x: mx,
      y: my,
      baseX: mx,
      baseY: my
    });
  }


  /* =========================================
     CREATE SNAKE HEAD
  ========================================= */

  const head = document.createElement('div');

  head.className = 'snake-cursor';

  head.style.left = mx + 'px';
  head.style.top = my + 'px';

  document.body.appendChild(head);


  /* =========================================
     SHOW SNAKE
  ========================================= */

  function showSnake() {

    pointerActive = true;

    head.classList.remove('hidden');
    head.classList.add('active');

    snake.forEach(segment => {

      segment.el.classList.remove('hidden');
      segment.el.classList.add('active');

    });
  }


  /* =========================================
     HIDE SNAKE
  ========================================= */

  function hideSnake() {

    pointerActive = false;

    head.classList.remove('active');
    head.classList.add('hidden');

    snake.forEach(segment => {

      segment.el.classList.remove('active');
      segment.el.classList.add('hidden');

    });
  }


  /* =========================================
     MOVE ORIGINAL CURSOR
  ========================================= */

  function updateOriginalCursor() {

    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';

    glow.style.left = mx + 'px';
    glow.style.top = my + 'px';
  }


  /* =========================================
     DESKTOP MOUSE
  ========================================= */

  window.addEventListener(
    'mousemove',
    e => {

      mx = e.clientX;
      my = e.clientY;

      updateOriginalCursor();

      if (!exploding) {
        showSnake();

        head.style.left = mx + 'px';
        head.style.top = my + 'px';
      }

    },
    { passive: true }
  );


  /* =========================================
     MOBILE TOUCH START
  ========================================= */

  window.addEventListener(
    'touchstart',
    e => {

      if (!e.touches.length) return;

      const touch = e.touches[0];

      mx = touch.clientX;
      my = touch.clientY;

      updateOriginalCursor();

      showSnake();

      head.style.left = mx + 'px';
      head.style.top = my + 'px';

    },
    { passive: true }
  );


  /* =========================================
     MOBILE TOUCH MOVE
  ========================================= */

  window.addEventListener(
    'touchmove',
    e => {

      if (!e.touches.length) return;

      const touch = e.touches[0];

      mx = touch.clientX;
      my = touch.clientY;

      updateOriginalCursor();

      if (!exploding) {

        showSnake();

        head.style.left = mx + 'px';
        head.style.top = my + 'px';

      }

    },
    { passive: true }
  );


  /* =========================================
     TOUCH END
  ========================================= */

  window.addEventListener(
    'touchend',
    () => {

      hideSnake();

    },
    { passive: true }
  );


  /* =========================================
     TOUCH CANCEL
  ========================================= */

  window.addEventListener(
    'touchcancel',
    () => {

      hideSnake();

    },
    { passive: true }
  );


  /* =========================================
     🐍 SNAKE ANIMATION
  ========================================= */

  function animateSnake() {

    if (!exploding) {

      /* HEAD FOLLOW */

      snake[0].x +=
        (mx - snake[0].x) * 0.42;

      snake[0].y +=
        (my - snake[0].y) * 0.42;


      /* OTHER SEGMENTS */

      for (let i = 1; i < snake.length; i++) {

        const previous = snake[i - 1];
        const current = snake[i];

        const dx =
          previous.x - current.x;

        const dy =
          previous.y - current.y;

        const distance =
          Math.hypot(dx, dy);


        const followSpeed =
          Math.max(
            0.16,
            0.30 - i * 0.006
          );


        current.x +=
          dx * followSpeed;

        current.y +=
          dy * followSpeed;


        /* Organic movement */

        const time = performance.now();

        const wave =
          Math.sin(
            time * 0.006 +
            i * 0.65
          ) *
          (1.2 + i * 0.08);


        current.x += wave;

        current.y +=
          Math.cos(
            time * 0.005 +
            i
          ) * 0.6;


        /* SIZE */

        const scale =
          1 -
          (i / snake.length) * 0.68;


        current.el.style.left =
          current.x + 'px';

        current.el.style.top =
          current.y + 'px';


        current.el.style.transform =
          `translate(-50%, -50%) scale(${scale})`;


        /* OPACITY */

        const opacity =
          1 -
          (i / snake.length) * 0.68;


        current.el.style.opacity =
          pointerActive
            ? opacity
            : 0;


        /* ROTATION */

        if (distance > 1) {

          const angle =
            Math.atan2(dy, dx) *
            180 /
            Math.PI;

          current.el.style.rotate =
            angle + 'deg';
        }

      }

    }


    requestAnimationFrame(
      animateSnake
    );
  }


  animateSnake();


  /* =========================================
     ORIGINAL RING SMOOTH FOLLOW
  ========================================= */

  function animateRing() {

    rx +=
      (mx - rx) * 0.13;

    ry +=
      (my - ry) * 0.13;

    ring.style.left =
      rx + 'px';

    ring.style.top =
      ry + 'px';

    requestAnimationFrame(
      animateRing
    );
  }


  animateRing();


  /* =========================================
     ✨ HOVER EFFECT
  ========================================= */

  const hoverEls =
    document.querySelectorAll(
      'a, button, .magnetic-btn, .skill-card, .project-card, .cert-card, .ai-option'
    );


  hoverEls.forEach(el => {

    el.addEventListener(
      'mouseenter',
      () => {

        document.body.classList.add(
          'cursor-hover'
        );

      }
    );


    el.addEventListener(
      'mouseleave',
      () => {

        document.body.classList.remove(
          'cursor-hover'
        );

      }
    );

  });


  /* =========================================
     💥 CLICK EXPLOSION
  ========================================= */

  window.addEventListener(
    'click',
    e => {

      /* Prevent double explosion */

      if (exploding) return;


      exploding = true;

      explosionX = e.clientX;
      explosionY = e.clientY;


      /* Hide original cursor slightly */

      head.style.left =
        explosionX + 'px';

      head.style.top =
        explosionY + 'px';


      /* =====================================
         SAVE CURRENT POSITIONS
      ===================================== */

      const savedPositions =
        snake.map(segment => ({
          x: segment.x,
          y: segment.y
        }));


      /* =====================================
         EXPLODE EVERY SEGMENT
      ===================================== */

      snake.forEach(
        (segment, index) => {

          const angle =
            Math.random() *
            Math.PI *
            2;


          const distance =
            80 +
            Math.random() * 170;


          const targetX =
            explosionX +
            Math.cos(angle) *
            distance;


          const targetY =
            explosionY +
            Math.sin(angle) *
            distance;


          segment.el.style.transition =
            'left 0.45s cubic-bezier(.15,.8,.25,1), ' +
            'top 0.45s cubic-bezier(.15,.8,.25,1), ' +
            'transform 0.45s ease, opacity 0.45s ease';


          segment.el.style.left =
            targetX + 'px';


          segment.el.style.top =
            targetY + 'px';


          segment.el.style.transform =
            `translate(-50%, -50%) scale(${0.4 + Math.random() * 1.2}) rotate(${Math.random() * 360}deg)`;


          segment.el.style.opacity =
            0.9;


          /* Save explosion target */

          segment.explosionX =
            targetX;

          segment.explosionY =
            targetY;

        }
      );


      /* =====================================
         HEAD EXPLOSION
      ===================================== */

      head.style.transition =
        'transform 0.45s ease, opacity 0.45s ease';


      head.style.transform =
        'translate(-50%, -50%) scale(2.8)';


      head.style.opacity =
        '0.2';


      /* =====================================
         REFORM AFTER DELAY
      ===================================== */

      setTimeout(
        () => {

          /* First bring every bubble back */

          snake.forEach(
            (segment, index) => {

              const returnDelay =
                index * 8;


              setTimeout(
                () => {

                  segment.el.style.transition =
                    'left 0.65s cubic-bezier(.22,.8,.25,1), ' +
                    'top 0.65s cubic-bezier(.22,.8,.25,1), ' +
                    'transform 0.65s ease, opacity 0.65s ease';


                  segment.el.style.left =
                    savedPositions[index].x + 'px';


                  segment.el.style.top =
                    savedPositions[index].y + 'px';


                  const scale =
                    1 -
                    (index / snake.length) *
                    0.68;


                  segment.el.style.transform =
                    `translate(-50%, -50%) scale(${scale})`;


                  segment.el.style.opacity =
                    pointerActive
                      ? 1 -
                        (index / snake.length) *
                        0.68
                      : 0;


                  segment.x =
                    savedPositions[index].x;

                  segment.y =
                    savedPositions[index].y;

                },
                returnDelay
              );

            }
          );


          /* Head returns */

          head.style.transition =
            'transform 0.65s ease, opacity 0.65s ease';


          head.style.transform =
            'translate(-50%, -50%) scale(1)';


          head.style.opacity =
            pointerActive
              ? '1'
              : '0';


          /* =================================
             FINISH EXPLOSION
          ================================= */

          setTimeout(
            () => {

              snake.forEach(
                segment => {

                  segment.el.style.transition =
                    'opacity 0.25s ease';

                }
              );


              head.style.transition =
                'opacity 0.25s ease';


              exploding = false;


              if (pointerActive) {

                showSnake();

              } else {

                hideSnake();

              }

            },
            750
          );


        },
        500
      );

    }
  );


  /* =========================================
     📱 MOBILE / DESKTOP
  ========================================= */

  function checkMobile() {

    const isMobile =
      window.innerWidth <= 640;


    if (isMobile) {

      /* Keep original cursor hidden */

      dot.style.display = 'none';
      ring.style.display = 'none';
      glow.style.display = 'none';

    } else {

      dot.style.display = '';
      ring.style.display = '';
      glow.style.display = '';

    }

  }


  checkMobile();


  window.addEventListener(
    'resize',
    checkMobile
  );

}
/* ─────────────────────────────────────────────
   5. NAVBAR SCROLL EFFECT
───────────────────────────────────────────── */

function initNavbar() {

  const nav =
    document.getElementById('navbar');


  if (!nav) return;


  window.addEventListener(
    'scroll',
    () => {

      nav.classList.toggle(
        'scrolled',
        window.scrollY > 20
      );

    },
    {
      passive: true
    }
  );

}



/* ─────────────────────────────────────────────
   6. HAMBURGER MENU
───────────────────────────────────────────── */

function initHamburger() {

  const ham =
    document.getElementById('hamburger');

  const links =
    document.getElementById('nav-links');

  const overlay =
    document.getElementById('mobile-overlay');


  if (!ham || !links || !overlay) {
    return;
  }


  function close() {

    ham.classList.remove(
      'open'
    );

    links.classList.remove(
      'open'
    );

    overlay.classList.remove(
      'active'
    );

  }


  ham.addEventListener(
    'click',
    () => {

      ham.classList.toggle(
        'open'
      );

      links.classList.toggle(
        'open'
      );

      overlay.classList.toggle(
        'active'
      );

    }
  );


  overlay.addEventListener(
    'click',
    close
  );


  links
    .querySelectorAll(
      '.nav-link'
    )
    .forEach(
      l =>
        l.addEventListener(
          'click',
          close
        )
    );

}



/* ─────────────────────────────────────────────
   7. HERO ROLE MORPH
───────────────────────────────────────────── */

function initHeroRoleMorph() {

  const el =
    document.getElementById(
      'hero-role'
    );


  if (!el) return;


  const roles = [
    'AI/ML Developer',
    'Web Developer',
    'Problem Solver',
    'Tech Enthusiast'
  ];


  let ri = 0;

  let ci = 0;

  let deleting = false;


  const SPEED_TYPE = 80;

  const SPEED_DEL = 45;

  const PAUSE = 2000;


  function type() {

    const current =
      roles[ri];


    if (!deleting) {

      el.textContent =
        current.slice(
          0,
          ++ci
        );


      if (
        ci ===
        current.length
      ) {

        deleting = true;

        setTimeout(
          type,
          PAUSE
        );

        return;
      }

    } else {

      el.textContent =
        current.slice(
          0,
          --ci
        );


      if (ci === 0) {

        deleting = false;

        ri =
          (ri + 1) %
          roles.length;

      }

    }


    setTimeout(
      type,
      deleting
        ? SPEED_DEL
        : SPEED_TYPE
    );

  }


  setTimeout(
    type,
    500
  );

}



/* ─────────────────────────────────────────────
   8. SCROLL ANIMATIONS
───────────────────────────────────────────── */

function initScrollAnimations() {

  const els =
    document.querySelectorAll(
      '[data-aos]'
    );


  const delays = {};


  els.forEach(
    el => {

      delays[el] =
        +(el.dataset.aosDelay || 0);

    }
  );


  const obs =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              const el =
                entry.target;


              setTimeout(
                () =>
                  el.classList.add(
                    'aos-animate'
                  ),
                delays[el] || 0
              );


              obs.unobserve(
                el
              );

            }

          }
        );

      },
      {
        threshold: 0.12
      }
    );


  els.forEach(
    el =>
      obs.observe(el)
  );

}



/* ─────────────────────────────────────────────
   9. 3D TILT CARDS
───────────────────────────────────────────── */

function initTiltCards() {

  document
    .querySelectorAll(
      '.tilt-card'
    )
    .forEach(
      card => {

        card.addEventListener(
          'mousemove',
          e => {

            const r =
              card.getBoundingClientRect();


            const cx =
              r.left +
              r.width / 2;


            const cy =
              r.top +
              r.height / 2;


            const dx =
              e.clientX - cx;


            const dy =
              e.clientY - cy;


            const rx =
              (dy / r.height) *
              -16;


            const ry =
              (dx / r.width) *
              16;


            card.style.transform =
              `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`;


            card.style.transition =
              'transform 0.1s ease';

          }
        );


        card.addEventListener(
          'mouseleave',
          () => {

            card.style.transform =
              '';

            card.style.transition =
              'transform 0.5s ease';

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   10. SKILL CARD SPOTLIGHT
───────────────────────────────────────────── */

function initSkillSpotlight() {

  document
    .querySelectorAll(
      '.skill-card'
    )
    .forEach(
      card => {

        const spot =
          card.querySelector(
            '.skill-spotlight'
          );


        if (!spot) return;


        card.addEventListener(
          'mousemove',
          e => {

            const r =
              card.getBoundingClientRect();


            const x =
              ((e.clientX - r.left) /
                r.width) *
              100;


            const y =
              ((e.clientY - r.top) /
                r.height) *
              100;


            card.style.setProperty(
              '--mx',
              x + '%'
            );


            card.style.setProperty(
              '--my',
              y + '%'
            );

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   11. PROJECT CARD SPOTLIGHT
───────────────────────────────────────────── */

function initProjectSpotlight() {

  document
    .querySelectorAll(
      '.project-card'
    )
    .forEach(
      card => {

        const spot =
          card.querySelector(
            '.project-spotlight'
          );


        if (!spot) return;


        card.addEventListener(
          'mousemove',
          e => {

            const r =
              card.getBoundingClientRect();


            const x =
              ((e.clientX - r.left) /
                r.width) *
              100;


            const y =
              ((e.clientY - r.top) /
                r.height) *
              100;


            card.style.setProperty(
              '--mx',
              x + '%'
            );


            card.style.setProperty(
              '--my',
              y + '%'
            );

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   12. SKILL CIRCULAR PROGRESS
───────────────────────────────────────────── */

function initSkillRadials() {

  const svg =
    document.createElementNS(
      'http://www.w3.org/2000/svg',
      'svg'
    );


  svg.setAttribute(
    'width',
    '0'
  );


  svg.setAttribute(
    'height',
    '0'
  );


  svg.style.position =
    'absolute';


  svg.innerHTML = `
    <defs>

      <linearGradient
        id="skillGrad"
        x1="0%"
        y1="0%"
        x2="100%"
        y2="100%"
      >

        <stop
          offset="0%"
          stop-color="#00f5ff"
        />

        <stop
          offset="50%"
          stop-color="#0066ff"
        />

        <stop
          offset="100%"
          stop-color="#d946ef"
        />

      </linearGradient>

    </defs>
  `;


  document.body.appendChild(
    svg
  );


  const obs =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) return;


            const prog =
              entry.target.querySelector(
                '.svg-progress'
              );


            if (!prog) return;


            const pct =
              +(prog.dataset.percent || 0);


            const circum =
              2 *
              Math.PI *
              50;


            const offset =
              circum *
              (1 - pct / 100);


            prog.style.strokeDasharray =
              circum;


            prog.style.strokeDashoffset =
              circum;


            requestAnimationFrame(
              () => {

                setTimeout(
                  () => {

                    prog.style.strokeDashoffset =
                      offset;

                  },
                  50
                );

              }
            );


            obs.unobserve(
              entry.target
            );

          }
        );

      },
      {
        threshold: 0.3
      }
    );


  document
    .querySelectorAll(
      '.skill-card'
    )
    .forEach(
      el =>
        obs.observe(el)
    );

}



/* ─────────────────────────────────────────────
   13. STAT NUMBER COUNTERS
───────────────────────────────────────────── */

function initStatCounters() {

  const obs =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              !entry.isIntersecting
            ) return;


            const el =
              entry.target;


            const target =
              +(el.dataset.target || 0);


            const suffix =
              el.dataset.suffix || '';


            animateCount(
              el,
              0,
              target,
              1600,
              suffix
            );


            obs.unobserve(
              el
            );

          }
        );

      },
      {
        threshold: 0.5
      }
    );


  document
    .querySelectorAll(
      '.stat-number'
    )
    .forEach(
      el =>
        obs.observe(el)
    );


  function animateCount(
    el,
    from,
    to,
    dur,
    suffix
  ) {

    const start =
      performance.now();


    function tick(now) {

      const t =
        Math.min(
          (now - start) / dur,
          1
        );


      const ease =
        1 -
        Math.pow(
          1 - t,
          3
        );


      el.textContent =
        Math.round(
          from +
          (to - from) *
          ease
        ) +
        suffix;


      if (t < 1) {

        requestAnimationFrame(
          tick
        );

      }

    }


    requestAnimationFrame(
      tick
    );

  }

}



/* ─────────────────────────────────────────────
   14. CONTACT FORM
───────────────────────────────────────────── */

function initContactForm() {

  const form =
    document.getElementById(
      'contact-form'
    );


  const success =
    document.getElementById(
      'form-success'
    );


  const submit =
    document.getElementById(
      'form-submit'
    );


  if (!form) return;


  form.addEventListener(
    'submit',
    e => {

      e.preventDefault();


      const name =
        document.getElementById(
          'form-name'
        );


      const email =
        document.getElementById(
          'form-email'
        );


      const msg =
        document.getElementById(
          'form-message'
        );


      let valid = true;


      [name, email, msg]
        .forEach(
          field => {

            if (
              !field.value.trim()
            ) {

              field.style.borderColor =
                '#f87171';


              valid = false;


              setTimeout(
                () => {

                  field.style.borderColor =
                    '';

                },
                2000
              );

            }

          }
        );


      if (
        email.value.trim() &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/
          .test(
            email.value.trim()
          )
      ) {

        email.style.borderColor =
          '#f87171';


        valid = false;


        setTimeout(
          () => {

            email.style.borderColor =
              '';

          },
          2000
        );

      }


      if (!valid) return;


      submit.innerHTML =
        '<span>Sending...</span><span class="btn-arrow">⏳</span>';


      submit.disabled = true;


      setTimeout(
        () => {

          submit.innerHTML =
            '<span>Sent!</span><span class="btn-arrow">✓</span>';


          success.style.display =
            'block';


          form.reset();


          setTimeout(
            () => {

              submit.innerHTML =
                '<span>Send Message</span><span class="btn-arrow">✈</span>';


              submit.disabled =
                false;


              success.style.display =
                'none';

            },
            4000
          );

        },
        1500
      );

    }
  );

}



/* ─────────────────────────────────────────────
   15. AI ASSISTANT
───────────────────────────────────────────── */

function initAIAssistant() {

  const fab =
    document.getElementById(
      'ai-fab'
    );


  const panel =
    document.getElementById(
      'ai-panel'
    );


  const closeBtn =
    document.getElementById(
      'ai-close'
    );


  if (!fab || !panel || !closeBtn) {
    return;
  }


  fab.addEventListener(
    'click',
    () =>
      panel.classList.toggle(
        'open'
      )
  );


  closeBtn.addEventListener(
    'click',
    () =>
      panel.classList.remove(
        'open'
      )
  );


  document
    .querySelectorAll(
      '.ai-option'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'click',
          () => {

            const target =
              btn.dataset.target;


            panel.classList.remove(
              'open'
            );


            const section =
              document.getElementById(
                target
              );


            if (section) {

              setTimeout(
                () => {

                  section.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                  });

                },
                200
              );

            }

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   16. MAGNETIC BUTTONS
───────────────────────────────────────────── */

function initMagneticButtons() {

  document
    .querySelectorAll(
      '.magnetic-btn'
    )
    .forEach(
      btn => {

        btn.addEventListener(
          'mousemove',
          e => {

            const r =
              btn.getBoundingClientRect();


            const cx =
              r.left +
              r.width / 2;


            const cy =
              r.top +
              r.height / 2;


            const dx =
              (e.clientX - cx) *
              0.3;


            const dy =
              (e.clientY - cy) *
              0.3;


            btn.style.transform =
              `translate(${dx}px, ${dy}px)`;


            btn.style.transition =
              'transform 0.1s ease';

          }
        );


        btn.addEventListener(
          'mouseleave',
          () => {

            btn.style.transform =
              '';


            btn.style.transition =
              'transform 0.4s ease';

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   17. PARALLAX BACKGROUND
───────────────────────────────────────────── */

function initParallax() {

  const grid =
    document.querySelector(
      '.hero-bg-grid'
    );


  if (!grid) return;


  window.addEventListener(
    'mousemove',
    e => {

      const x =
        (
          e.clientX /
          window.innerWidth -
          0.5
        ) *
        20;


      const y =
        (
          e.clientY /
          window.innerHeight -
          0.5
        ) *
        20;


      grid.style.transform =
        `translate(${x}px, ${y}px)`;

    },
    {
      passive: true
    }
  );

}



/* ─────────────────────────────────────────────
   18. ACTIVE NAV HIGHLIGHT
───────────────────────────────────────────── */

function initActiveNav() {

  const sections =
    document.querySelectorAll(
      'section[id]'
    );


  const navLinks =
    document.querySelectorAll(
      '.nav-link[data-section]'
    );


  const obs =
    new IntersectionObserver(
      entries => {

        entries.forEach(
          entry => {

            if (
              entry.isIntersecting
            ) {

              navLinks.forEach(
                l => {

                  l.classList.toggle(
                    'active',
                    l.dataset.section ===
                    entry.target.id
                  );

                }
              );

            }

          }
        );

      },
      {
        threshold: 0.35,

        rootMargin:
          '-70px 0px -70px 0px'
      }
    );


  sections.forEach(
    s =>
      obs.observe(s)
  );


  /* Smooth scroll */

  document
    .querySelectorAll(
      'a[href^="#"]'
    )
    .forEach(
      a => {

        a.addEventListener(
          'click',
          e => {

            const target =
              document.querySelector(
                a.getAttribute(
                  'href'
                )
              );


            if (target) {

              e.preventDefault();


              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });

            }

          }
        );

      }
    );

}



/* ─────────────────────────────────────────────
   19. HOLOGRAPHIC FRAME MOUSE PARALLAX
───────────────────────────────────────────── */

(function holoParallax() {

  const holo =
    document.querySelector(
      '.holo-frame'
    );


  if (!holo) return;


  window.addEventListener(
    'mousemove',
    e => {

      const cx =
        window.innerWidth / 2;


      const cy =
        window.innerHeight / 2;


      const dx =
        (e.clientX - cx) /
        cx;


      const dy =
        (e.clientY - cy) /
        cy;


      holo.style.transform =
        `rotateY(${dx * 10}deg) rotateX(${-dy * 6}deg)`;


      holo.style.transition =
        'transform 0.3s ease';

    },
    {
      passive: true
    }
  );


  window.addEventListener(
    'mouseleave',
    () => {

      holo.style.transform =
        '';

    }
  );

})();
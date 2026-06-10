/* ============================================
   Portfolio — GSAP + ScrollTrigger
   ============================================ */

(function () {
  'use strict';

  var header = document.getElementById('header');
  var navToggle = document.getElementById('nav-toggle');
  var navMenu = document.getElementById('nav-menu');
  var navLinks = document.querySelectorAll('.nav__link');
  var sections = document.querySelectorAll('section[id]');
  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger);

  var scrubDefaults = { ease: 'none', immediateRender: false };

  /* Tighter range = no peeking at section bottom while scrubbing */
  var revealStart = 'top 68%';
  var revealEnd = 'top 48%';
  var gridStart = 'top 68%';
  var gridEnd = 'top 38%';

  function scrubReveal(target, trigger, fromVars, toVars, st) {
    gsap.fromTo(target, fromVars, Object.assign({}, toVars, {
      ease: 'none',
      immediateRender: false,
      scrollTrigger: Object.assign({
        trigger: trigger,
        start: revealStart,
        end: revealEnd,
        scrub: 0.8
      }, st || {})
    }));
  }

  /* --- Nav utilities --- */
  function handleScroll() {
    header.classList.toggle('scrolled', window.scrollY > 50);
    highlightNav();
  }

  function highlightNav() {
    var scrollPos = window.scrollY + header.offsetHeight + 100;

    sections.forEach(function (section) {
      var top = section.offsetTop;
      var height = section.offsetHeight;
      var id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(function (link) {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  navToggle.addEventListener('click', function () {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      navToggle.classList.remove('active');
      navMenu.classList.remove('open');
    });
  });

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  initCursor();
  initLightbox();
  initProcessScratch();
  initDrums();

  if (prefersReducedMotion) {
    gsap.set('.hero__window', { xPercent: -50, yPercent: -50, opacity: 1, y: 0 });
    gsap.set('.hero__code-line', { opacity: 1, visibility: 'visible' });
    gsap.set('.reveal, .section__header .section__number, .section__header .section__title, .section__intro, .stat, .skill-card, .process__step, .project, .timeline__item, .testimonial, .cert-card, .award-card, .blog-card, .drum-pad, .contact__text, .contact__email, .social-link', { opacity: 1, x: 0, y: 0, clearProps: 'transform' });
    document.querySelectorAll('.stat__number').forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
    return;
  }

  function initCursor() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var cursor = document.getElementById('cursor');
    var dot = cursor.querySelector('.cursor__dot');
    var ring = cursor.querySelector('.cursor__ring');
    var hoverTargets = document.querySelectorAll(
      'a, button, .btn, .skill-card, .project, .social-link, .nav__toggle, .process__step, .timeline__item, .testimonial, .cert-card, .award-card, .cert-card__thumb, .blog-card, .drum-pad'
    );

    document.body.classList.add('custom-cursor');

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    var dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' });
    var dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' });
    var ringX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
    var ringY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });

    function moveCursor(x, y) {
      dotX(x);
      dotY(y);
      ringX(x);
      ringY(y);
    }

    window.addEventListener('mousemove', function (e) {
      moveCursor(e.clientX, e.clientY);
      cursor.classList.add('is-visible');
      cursor.classList.remove('is-hidden');
    }, { passive: true });

    document.addEventListener('mouseleave', function () {
      cursor.classList.add('is-hidden');
    });

    document.addEventListener('mouseenter', function () {
      cursor.classList.remove('is-hidden');
    });

    window.addEventListener('mousedown', function () {
      cursor.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', function () {
      cursor.classList.remove('is-clicking');
    });

    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () {
        cursor.classList.add('is-hover');
      });
      el.addEventListener('mouseleave', function () {
        cursor.classList.remove('is-hover');
      });
    });
  }

  /* --- Hero entrance on load --- */
  gsap.set('.hero__window', { xPercent: -50, yPercent: -50, opacity: 0, y: 30 });
  gsap.set('.hero__code-line:not(.hero__code-line--cursor)', { opacity: 0, x: -16 });
  gsap.set('.hero__code-line--cursor', { opacity: 0 });

  var heroTl = gsap.timeline({
    defaults: { ease: 'power3.out' },
    onComplete: function () {
      gsap.set('.hero .reveal, .hero__canvas, .hero__window, .hero__code, .hero__code-line', {
        opacity: 1,
        visibility: 'visible',
        y: 0,
        x: 0,
        clearProps: 'transform'
      });
      gsap.set('.hero__code-line:not(.hero__code-line--cursor)', { opacity: 0.55 });
      gsap.set('.hero__code-line--cursor', { opacity: 1 });
      gsap.set('.hero__window', { xPercent: -50, yPercent: -50, y: 0 });
    }
  });

  heroTl
    .from('.hero__label', { y: 30, opacity: 0, duration: 0.8 })
    .from('.hero__title', { y: 50, opacity: 0, duration: 1 }, '-=0.5')
    .from('.hero__desc', { y: 30, opacity: 0, duration: 0.8 }, '-=0.6')
    .from('.hero__actions', { y: 20, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero__canvas', { scale: 0.8, opacity: 0, rotationY: -15, duration: 1.1 }, '-=0.7')
    .from('.hero__corner', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.08 }, '-=0.6')
    .to('.hero__window', { opacity: 1, y: 0, duration: 0.9 }, '-=0.5')
    .to('.hero__code-line:not(.hero__code-line--cursor)', { opacity: 0.55, x: 0, duration: 0.45, stagger: 0.08 }, '-=0.65')
    .to('.hero__code-line--cursor', { opacity: 1, duration: 0.3 }, '-=0.25')
    .from('.hero__tag', { scale: 0, opacity: 0, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, '-=0.3')
    .from('.hero__ui-card', { x: 30, opacity: 0, duration: 0.7 }, '-=0.5')
    .from('.hero__ring', { scale: 0.6, opacity: 0, duration: 1 }, '-=0.8')
    .from('.hero__scroll', { opacity: 0, duration: 0.6 }, '-=0.3');

  initHeroVisual();

  /* --- Hero parallax scrub --- */
  gsap.to('.hero__content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.2
    },
    y: -80,
    opacity: 0.3,
    ease: 'none'
  });

  gsap.to('.hero__canvas', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5
    },
    y: 100,
    rotation: 4,
    scale: 0.9,
    ease: 'none'
  });

  function initHeroVisual() {
    var canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    /* Continuous ring rotation */
    gsap.to('.hero__ring', {
      rotation: 360,
      duration: 30,
      repeat: -1,
      ease: 'none'
    });

    /* Orbit rotation */
    gsap.to('.hero__orbit', {
      rotation: 360,
      duration: 18,
      repeat: -1,
      ease: 'none'
    });

    /* Floating tags */
    gsap.utils.toArray('.hero__tag').forEach(function (tag, i) {
      gsap.to(tag, {
        y: i % 2 === 0 ? -12 : 12,
        duration: 2 + i * 0.4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.3
      });
    });

    /* UI card float */
    gsap.to('.hero__ui-card', {
      y: -10,
      rotation: 3,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    /* Pulse ring breathe */
    gsap.to('.hero__pulse', {
      scale: 1.15,
      opacity: 0.6,
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    /* Mesh cell random glow */
    var meshCells = gsap.utils.toArray('.hero__mesh span');
    function lightRandomCell() {
      var cell = meshCells[Math.floor(Math.random() * meshCells.length)];
      cell.classList.add('is-lit');
      gsap.delayedCall(0.6 + Math.random() * 0.8, function () {
        cell.classList.remove('is-lit');
      });
    }
    gsap.timeline({ repeat: -1 })
      .call(lightRandomCell)
      .to({}, { duration: 0.25 });

    /* Code line highlight cycle */
    var codeLines = gsap.utils.toArray('.hero__code-line:not(.hero__code-line--cursor)');
    var lineIndex = 0;
    gsap.timeline({ repeat: -1, delay: 1.5 })
      .call(function () {
        codeLines.forEach(function (line) { line.classList.remove('is-highlighted'); });
        codeLines[lineIndex].classList.add('is-highlighted');
        lineIndex = (lineIndex + 1) % codeLines.length;
      })
      .to({}, { duration: 1.2 });

    /* Mouse parallax on hero visual */
    var heroSection = document.querySelector('.hero');
    heroSection.addEventListener('mousemove', function (e) {
      var rect = heroSection.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(canvas, { rotationY: x * 12, rotationX: -y * 8, duration: 0.8, ease: 'power2.out' });
      gsap.to('.hero__window', { xPercent: -50, yPercent: -50, x: x * 18, y: y * 12, duration: 0.8, ease: 'power2.out' });
      gsap.to('.hero__tag--1', { x: x * 25, y: y * 15, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__tag--2', { x: x * 20, y: y * 10, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__tag--3', { x: x * 22, y: y * 14, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__tag--4', { x: x * 18, y: y * 12, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__ui-card', { x: x * 30, y: y * 20, duration: 1, ease: 'power2.out' });
    });

    heroSection.addEventListener('mouseleave', function () {
      gsap.to(canvas, { rotationY: 0, rotationX: 0, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__window', { xPercent: -50, yPercent: -50, x: 0, y: 0, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__tag', { x: 0, y: 0, duration: 1, ease: 'power2.out' });
      gsap.to('.hero__ui-card', { x: 0, y: 0, duration: 1, ease: 'power2.out' });
    });
  }

  /* --- Scroll-driven shapes --- */
  gsap.to('.shape--circle', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.8 },
    rotation: 360, x: 100, y: -280, ease: 'none'
  });

  gsap.to('.shape--triangle', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2.2 },
    rotation: -270, x: 160, y: -400, scale: 1.3, ease: 'none'
  });

  gsap.to('.shape--square', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.5 },
    rotation: 180, x: -120, y: -500, ease: 'none'
  });

  gsap.to('.shape--diamond', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 2 },
    rotation: 225, x: 200, y: 350, ease: 'none'
  });

  gsap.to('.shape--line', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1 },
    scaleY: 2.5, y: -200, opacity: 0.6, ease: 'none'
  });

  gsap.to('.shape--dot-grid', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: 1.6 },
    y: -350, x: 80, rotation: 45, ease: 'none'
  });

  /* --- Section header scrub reveals (trigger on parent section) --- */
  gsap.utils.toArray('section[id]').forEach(function (section) {
    if (section.id === 'home') return;

    var header = section.querySelector('.section__header');
    if (!header) return;

    var number = header.querySelector('.section__number');
    var title = header.querySelector('.section__title');

    scrubReveal(number, section, { x: -30, opacity: 0 }, { x: 0, opacity: 1 });
    scrubReveal(title, section, { y: 36, opacity: 0 }, { y: 0, opacity: 1 }, { scrub: 1 });
  });

  /* --- Generic content scrub reveals --- */
  gsap.utils.toArray('.reveal').forEach(function (el) {
    if (el.closest('.hero')) return;
    if (el.closest('.section__header')) return;

    scrubReveal(el, el, { y: 36, opacity: 0 }, { y: 0, opacity: 1 });
  });

  /* --- About stats scrub + counter up --- */
  gsap.fromTo('.stat',
    { x: 30, opacity: 0 },
    {
      x: 0,
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      immediateRender: false,
      scrollTrigger: {
        trigger: '.about__stats',
        start: revealStart,
        end: revealEnd,
        scrub: 0.8
      }
    }
  );

  var statCountersPlayed = false;

  var statCounters = gsap.utils.toArray('.stat__number').map(function (el, i) {
    var count = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var counter = { value: 0 };

    var tween = gsap.to(counter, {
      value: count,
      duration: 2,
      delay: i * 0.2,
      ease: 'power2.out',
      paused: true,
      onUpdate: function () {
        el.textContent = Math.round(counter.value) + suffix;
      },
      onComplete: function () {
        el.textContent = count + suffix;
      }
    });

    return { el: el, count: count, suffix: suffix, counter: counter, tween: tween };
  });

  function playStatCounters() {
    if (statCountersPlayed) return;
    statCountersPlayed = true;

    statCounters.forEach(function (item) {
      item.counter.value = 0;
      item.el.textContent = '0' + item.suffix;
      item.tween.restart(true);
    });
  }

  ScrollTrigger.create({
    trigger: '.about__stats',
    start: 'top 85%',
    once: true,
    onEnter: playStatCounters
  });

  function scrubGrid(selector, trigger, fromVars) {
    gsap.timeline({
      scrollTrigger: {
        trigger: trigger,
        start: gridStart,
        end: gridEnd,
        scrub: 1
      }
    }).fromTo(selector, fromVars, {
      y: 0,
      x: 0,
      opacity: 1,
      stagger: 0.1,
      ease: 'none',
      immediateRender: false
    });
  }

  scrubGrid('.skill-card', '#skills', { y: 44, opacity: 0 });
  scrubGrid('.project', '#work', { y: 50, opacity: 0 });
  scrubGrid('.timeline__item', '#experience', { x: -36, opacity: 0 });
  scrubGrid('.testimonial', '#testimonials', { y: 44, opacity: 0 });
  scrubGrid('.cert-card', '#certifications .certs__grid', { y: 44, opacity: 0 });
  scrubGrid('.award-card', '#certifications .awards__grid', { y: 44, opacity: 0 });
  scrubGrid('.blog-card', '#blog', { y: 44, opacity: 0 });
  scrubGrid('.drum-pad', '#drums', { y: 36, opacity: 0 });

  /* --- Project image parallax (no opacity changes) --- */
  gsap.utils.toArray('.project').forEach(function (project, i) {
    var image = project.querySelector('.project__image');

    gsap.to(image, {
      scrollTrigger: {
        trigger: project,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 2
      },
      y: i % 2 === 0 ? -25 : 25,
      ease: 'none'
    });
  });

  /* --- Contact section scrub --- */
  gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: revealStart,
      end: revealEnd,
      scrub: 0.8
    }
  })
    .fromTo('.contact__text', { y: 28, opacity: 0 }, { y: 0, opacity: 1, ease: 'none', immediateRender: false })
    .fromTo('.contact__email', { scale: 0.96, opacity: 0 }, { scale: 1, opacity: 1, ease: 'none', immediateRender: false }, '-=0.3')
    .fromTo('.social-link', { y: 18, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.08, ease: 'none', immediateRender: false }, '-=0.2');

  /* --- Scroll progress bar --- */
  gsap.to('.scroll-progress', {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3
    }
  });

  window.addEventListener('load', function () {
    ScrollTrigger.refresh();
  });

  function initProcessScratch() {
    var wrapper = document.getElementById('process-scratch');
    var canvas = document.getElementById('process-scratch-canvas');
    var hint = document.getElementById('process-scratch-hint');
    if (!wrapper || !canvas) return;

    var isMobileProcess = window.matchMedia('(max-width: 768px)').matches;

    if (prefersReducedMotion || isMobileProcess) {
      wrapper.classList.add('is-revealed-nojs');
      return;
    }

    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var revealed = false;
    var brushSize = 36;
    var lastX = 0;
    var lastY = 0;
    var checkTimer = null;

    function resize() {
      var rect = wrapper.getBoundingClientRect();
      var dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      fillCoating(rect.width, rect.height);
    }

    function fillCoating(w, h) {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
      for (var i = 0; i < w; i += 12) {
        for (var j = 0; j < h; j += 12) {
          if ((i + j) % 24 === 0) ctx.fillRect(i, j, 1, 1);
        }
      }

      ctx.fillStyle = 'rgba(245, 245, 245, 0.08)';
      ctx.font = '600 11px Inter, sans-serif';
      ctx.textAlign = 'center';
      var label = 'SCRATCH TO REVEAL';
      var step = 140;
      for (var y = 60; y < h; y += step) {
        for (var x = 70; x < w; x += step) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(-0.35);
          ctx.fillText(label, 0, 0);
          ctx.restore();
        }
      }
    }

    function getPos(e) {
      var rect = canvas.getBoundingClientRect();
      var touch = e.touches ? e.touches[0] : (e.changedTouches ? e.changedTouches[0] : null);
      return {
        x: (touch ? touch.clientX : e.clientX) - rect.left,
        y: (touch ? touch.clientY : e.clientY) - rect.top
      };
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x2, y2, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    function scratchAt(x, y) {
      if (lastX || lastY) {
        drawLine(lastX, lastY, x, y);
      } else {
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      lastX = x;
      lastY = y;
    }

    function checkScratched() {
      if (revealed) return;
      var w = canvas.width;
      var h = canvas.height;
      var data = ctx.getImageData(0, 0, w, h).data;
      var cleared = 0;
      var sampled = 0;
      var stride = 28;

      for (var i = 3; i < data.length; i += stride) {
        sampled++;
        if (data[i] < 40) cleared++;
      }

      if (cleared / sampled > 0.42) completeReveal();
    }

    function launchConfetti() {
      var container = document.getElementById('process-confetti');
      if (!container || typeof gsap === 'undefined') return;

      var colors = [
        '#ff4757', '#ff6b81', '#ffa502', '#ffdd59', '#2ed573',
        '#1e90ff', '#3742fa', '#a55eea', '#70a1ff', '#ff7f50',
        '#00d2d3', '#f368e0', '#ff9ff3', '#54a0ff', '#5f27cd',
        '#0a0a0a', '#f5f5f5'
      ];
      var shapes = ['rect', 'circle', 'strip'];

      function spawnBurst(originX, originY, count, delayBase) {
        for (var i = 0; i < count; i++) {
          var piece = document.createElement('span');
          var shape = shapes[Math.floor(Math.random() * shapes.length)];
          var size = 5 + Math.random() * 9;
          var isCircle = shape === 'circle';
          var isStrip = shape === 'strip';

          piece.className = 'confetti-piece ' + (isCircle ? 'confetti-piece--circle' : 'confetti-piece--rect');
          piece.style.width = (isStrip ? size * 0.35 : size) + 'px';
          piece.style.height = (isCircle ? size : size * (isStrip ? 2.2 : 0.5 + Math.random() * 0.7)) + 'px';
          piece.style.background = colors[Math.floor(Math.random() * colors.length)];
          piece.style.left = originX + '%';
          piece.style.top = originY + '%';
          container.appendChild(piece);

          var angle = Math.random() * Math.PI * 2;
          var distance = 100 + Math.random() * 220;
          var x = Math.cos(angle) * distance;
          var y = Math.sin(angle) * distance - (50 + Math.random() * 60);

          gsap.fromTo(piece,
            { xPercent: -50, yPercent: -50, x: 0, y: 0, opacity: 1, rotation: 0, scale: 0 },
            {
              xPercent: -50,
              yPercent: -50,
              x: x,
              y: y,
              opacity: 0,
              rotation: Math.random() * 900 - 450,
              scale: 0.8 + Math.random() * 0.6,
              duration: 1.1 + Math.random() * 1.2,
              ease: 'power3.out',
              delay: delayBase + Math.random() * 0.25,
              onComplete: function () {
                piece.remove();
              }
            }
          );
        }
      }

      spawnBurst(50, 45, 70, 0);
      spawnBurst(35, 55, 40, 0.12);
      spawnBurst(65, 50, 40, 0.2);
    }

    function completeReveal() {
      if (revealed) return;
      revealed = true;
      wrapper.classList.add('is-revealed');
      isDrawing = false;

      if (typeof gsap !== 'undefined') {
        gsap.to(canvas, { opacity: 0, duration: 0.55, ease: 'power2.out' });
        launchConfetti();
        gsap.from('.process__scratch-content .process__step', {
          y: 20,
          opacity: 0,
          stagger: 0.07,
          duration: 0.5,
          ease: 'power2.out',
          delay: 0.15
        });
      } else {
        canvas.style.opacity = '0';
      }
    }

    function startDraw(e) {
      if (revealed) return;
      isDrawing = true;
      wrapper.classList.add('is-scratching');
      lastX = 0;
      lastY = 0;
      var pos = getPos(e);
      scratchAt(pos.x, pos.y);
      e.preventDefault();
    }

    function moveDraw(e) {
      if (!isDrawing || revealed) return;
      var pos = getPos(e);
      scratchAt(pos.x, pos.y);
      if (!checkTimer) {
        checkTimer = setTimeout(function () {
          checkScratched();
          checkTimer = null;
        }, 120);
      }
      e.preventDefault();
    }

    function endDraw() {
      isDrawing = false;
      lastX = 0;
      lastY = 0;
      checkScratched();
    }

    canvas.addEventListener('mousedown', startDraw);
    canvas.addEventListener('mousemove', moveDraw);
    window.addEventListener('mouseup', endDraw);
    canvas.addEventListener('touchstart', startDraw, { passive: false });
    canvas.addEventListener('touchmove', moveDraw, { passive: false });
    canvas.addEventListener('touchend', endDraw);

    window.addEventListener('resize', resize);
    resize();

    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.create({
        trigger: wrapper,
        start: 'top 90%',
        once: true,
        onEnter: resize
      });
    }
  }

  function initDrums() {
    var kit = document.getElementById('drum-kit');
    if (!kit) return;

    var pads = kit.querySelectorAll('.drum-pad');
    var audioCtx = null;
    var keyMap = {};

    pads.forEach(function (pad) {
      keyMap[pad.getAttribute('data-key')] = pad;
    });

    function getAudio() {
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioCtx.state === 'suspended') audioCtx.resume();
      return audioCtx;
    }

    function noiseBurst(ctx, duration, filterFreq, gainValue) {
      var bufferSize = ctx.sampleRate * duration;
      var buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      var data = buffer.getChannelData(0);
      for (var i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      var source = ctx.createBufferSource();
      var filter = ctx.createBiquadFilter();
      var gain = ctx.createGain();

      source.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = filterFreq;
      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start();
    }

    function toneHit(ctx, freq, duration, type, gainValue) {
      var osc = ctx.createOscillator();
      var gain = ctx.createGain();

      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(freq * 0.2, 40), ctx.currentTime + duration);

      gain.gain.setValueAtTime(gainValue, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration + 0.05);
    }

    function playSound(type) {
      var ctx = getAudio();

      switch (type) {
        case 'kick':
          toneHit(ctx, 150, 0.45, 'sine', 0.9);
          break;
        case 'snare':
          toneHit(ctx, 220, 0.08, 'triangle', 0.35);
          noiseBurst(ctx, 0.18, 800, 0.55);
          break;
        case 'hihat':
          noiseBurst(ctx, 0.06, 5000, 0.35);
          break;
        case 'tomHigh':
          toneHit(ctx, 280, 0.28, 'sine', 0.5);
          break;
        case 'tomMid':
          toneHit(ctx, 200, 0.32, 'sine', 0.55);
          break;
        case 'tomLow':
          toneHit(ctx, 140, 0.36, 'sine', 0.6);
          break;
        case 'crash':
          noiseBurst(ctx, 0.9, 2000, 0.45);
          break;
        case 'ride':
          noiseBurst(ctx, 0.5, 3500, 0.3);
          toneHit(ctx, 420, 0.15, 'sine', 0.12);
          break;
      }
    }

    function hitPad(pad) {
      var drum = pad.getAttribute('data-drum');
      playSound(drum);
      pad.classList.add('is-hit');
      setTimeout(function () { pad.classList.remove('is-hit'); }, 120);

      if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        gsap.fromTo(pad, { scale: 0.94 }, { scale: 1, duration: 0.15, ease: 'elastic.out(1, 0.5)' });
      }
    }

    pads.forEach(function (pad) {
      pad.addEventListener('click', function () {
        hitPad(pad);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.repeat) return;
      var key = e.key.toLowerCase();
      if (keyMap[key]) {
        e.preventDefault();
        hitPad(keyMap[key]);
      }
    });
  }

  function initLightbox() {
    var lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    var lightboxImg = lightbox.querySelector('.lightbox__img');
    var lightboxCaption = lightbox.querySelector('.lightbox__caption');
    var closeEls = lightbox.querySelectorAll('[data-lightbox-close]');
    var thumbs = document.querySelectorAll('.cert-card__thumb');
    var lastFocus = null;

    function openLightbox(imgSrc, imgAlt, caption) {
      lastFocus = document.activeElement;
      lightboxImg.src = imgSrc;
      lightboxImg.alt = imgAlt;
      lightboxCaption.textContent = caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('lightbox-open');
      lightbox.querySelector('.lightbox__close').focus();

      if (!prefersReducedMotion) {
        gsap.fromTo(lightbox.querySelector('.lightbox__dialog'),
          { scale: 0.9, y: 24, opacity: 0 },
          { scale: 1, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' }
        );
      }
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('lightbox-open');
      lightboxImg.src = '';
      if (lastFocus) lastFocus.focus();
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        var img = thumb.querySelector('img');
        var caption = thumb.getAttribute('data-caption') || img.alt;
        openLightbox(img.src, img.alt, caption);
      });
    });

    closeEls.forEach(function (el) {
      el.addEventListener('click', closeLightbox);
    });

    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeLightbox();
    });
  }
})();

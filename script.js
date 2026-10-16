/* ============================================================
   Dr. Himmat Singh Sinha Trust — behaviour layer
   Dependencies: none required. Lenis (smooth scroll) and
   Three.js (hero sculpture) are loaded progressively and the
   site degrades gracefully if either is unavailable.
   ============================================================ */
(() => {
  'use strict';

  /* ── Section labels — unchanged from the original site ────── */
  const sectionLabels = {
    biography: "Biography",
    bibliography: "Bibliography",
    books: "Books",
    writings: "Writings",
    publications: "Publications",
    achievements: "Achievements",
    articles: "Articles",
    gallery: "Gallery",
    contact: "Contact",
  };

  const doc = document;
  const $  = (sel, ctx = doc) => ctx.querySelector(sel);
  const $$ = (sel, ctx = doc) => Array.from(ctx.querySelectorAll(sel));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer  = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const dialog        = $('.content-dialog');
  const backdrop      = $('.dialog-backdrop');
  const dialogTitle   = $('#dialog-title');
  const dialogCategory= $('#dialog-category');
  const dialogNumber  = $('.dialog-number');
  const closeButton   = $('.dialog-close');
  const menuToggle    = $('.menu-toggle');
  const mobileMenu    = $('#mobile-menu');
  const header        = $('#site-header');
  const heroVisual    = $('#hero-visual');
  const heroTitle     = $('.hero-title');
  let returnFocusTo = null;
  let lenis = null;

  /* ── Safety net: never leave content hidden ───────────────── */
  function forceRevealAll() {
    $$('[data-reveal], .hero-title').forEach((el) => el.classList.add('is-in'));
  }
  window.setTimeout(forceRevealAll, 3500);

  try {

    /* ══════════════════════════════════════════════════════
       1 · ENTRANCE
       ══════════════════════════════════════════════════════ */
    const preloader = $('#preloader');
    const preFill   = $('#preloader-fill');

    if (!preloader || reduceMotion) {
      preloader && preloader.remove();
      heroTitle && heroTitle.classList.add('is-in');
      forceRevealAll();
    } else {
      let pct = 0;
      const tick = window.setInterval(() => {
        pct = Math.min(92, pct + Math.random() * 22);
        preFill.style.width = pct + '%';
      }, 130);

      const finish = () => {
        window.clearInterval(tick);
        preFill.style.width = '100%';
        window.setTimeout(() => {
          preloader.classList.add('is-done');
          heroTitle && heroTitle.classList.add('is-in');
          window.setTimeout(() => preloader.remove(), 600);
        }, 220);
      };

      if (document.readyState === 'complete') finish();
      else window.addEventListener('load', finish, { once: true });
      // Never trap the visitor behind the intro
      window.setTimeout(finish, 2600);
    }

    /* ══════════════════════════════════════════════════════
       2 · DIALOG — original behaviour, restyled shell
       ══════════════════════════════════════════════════════ */
    function openSection(section, trigger) {
      const title = sectionLabels[section];
      if (!title) return;
      returnFocusTo = trigger;
      dialogTitle.textContent = title;
      dialogCategory.textContent = title;
      dialogNumber.textContent = String(Object.keys(sectionLabels).indexOf(section) + 1).padStart(2, '0');
      $$('.nav-link').forEach((link) => {
        link.classList.toggle('is-current', link.dataset.section === section);
      });
      closeMobileMenu();
      backdrop.hidden = false;
      dialog.showModal();
      document.body.classList.add('dialog-open');
      doc.documentElement.classList.add('no-scroll');
      lenis && lenis.stop();
      requestAnimationFrame(() => backdrop.classList.add('is-visible'));
      closeButton.focus();
    }

    function closeSection() {
      if (!dialog.open) return;
      backdrop.classList.remove('is-visible');
      dialog.close();
      document.body.classList.remove('dialog-open');
      doc.documentElement.classList.remove('no-scroll');
      lenis && lenis.start();
      window.setTimeout(() => { backdrop.hidden = true; }, 500);
      if (returnFocusTo instanceof HTMLElement) {
        if (window.matchMedia('(max-width: 1140px)').matches && mobileMenu.contains(returnFocusTo)) {
          openMobileMenu();
        }
        returnFocusTo.focus();
      }
    }

    $$('[data-section]').forEach((control) => {
      control.addEventListener('click', () => openSection(control.dataset.section, control));
    });

    $$('[data-home]').forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        closeSection();
        $$('.nav-link').forEach((l) => l.classList.remove('is-current'));
        $$('.mobile-link').forEach((l) => l.classList.remove('is-current'));
        const home = $('.nav-link[data-home]');
        home && home.classList.add('is-current');
        closeMobileMenu();
        (lenis ? lenis.scrollTo(0) : window.scrollTo({ top: 0 }));
      });
    });

    closeButton.addEventListener('click', closeSection);
    dialog.addEventListener('click', (event) => { if (event.target === dialog) closeSection(); });
    backdrop.addEventListener('click', closeSection);
    dialog.addEventListener('cancel', (event) => { event.preventDefault(); closeSection(); });

    /* ══════════════════════════════════════════════════════
       3 · MOBILE NAVIGATION
       ══════════════════════════════════════════════════════ */
    function openMobileMenu() {
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Close navigation');
      mobileMenu.hidden = false;
      requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
      document.body.classList.add('dialog-open');
      doc.documentElement.classList.add('no-scroll');
      lenis && lenis.stop();
    }
    function closeMobileMenu() {
      if (!mobileMenu || mobileMenu.hidden) return;
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Open navigation');
      mobileMenu.classList.remove('is-open');
      document.body.classList.remove('dialog-open');
      doc.documentElement.classList.remove('no-scroll');
      lenis && lenis.start();
      window.setTimeout(() => { mobileMenu.hidden = true; }, 500);
    }

    if (menuToggle && mobileMenu) {
      $$('.mobile-link').forEach((link, i) => {
        link.style.transitionDelay = (80 + i * 38) + 'ms';
      });
      menuToggle.addEventListener('click', () => {
        (menuToggle.getAttribute('aria-expanded') === 'true' ? closeMobileMenu : openMobileMenu)();
      });
      doc.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        if (mobileMenu.classList.contains('is-open')) { closeMobileMenu(); menuToggle.focus(); }
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 1140) closeMobileMenu();
      });
      $$('.mobile-link').forEach((l) => l.addEventListener('click', closeMobileMenu));
    }

    /* ══════════════════════════════════════════════════════
       4 · SCROLL STATE — header, progress bar, index meter
       ══════════════════════════════════════════════════════ */
    const progressFill = $('#progress-fill');
    const indexMeter   = $('#index-meter');
    const indexSection = $('#sections');
    let lastY = 0;
    let ticking = false;

    function onScrollFrame() {
      ticking = false;
      const y = window.scrollY || window.pageYOffset;
      const max = doc.documentElement.scrollHeight - window.innerHeight;

      if (progressFill) progressFill.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';

      if (header) {
        header.classList.toggle('is-stuck', y > 24);
        header.classList.toggle('is-hidden', y > 520 && y > lastY + 6);
      }
      lastY = y;

      // Hero parallax (transform only — no layout thrash)
      if (hero && !reduceMotion) {
        const r = hero.getBoundingClientRect();
        const t = Math.max(-1, Math.min(1, -r.top / Math.max(r.height, 1)));
        parallaxTargets.forEach(({ el, speed }) => {
          el.style.transform = 'translate3d(0,' + (t * speed * 90).toFixed(2) + 'px,0)';
        });
      }

      // Index meter
      if (indexMeter && indexSection) {
        const r = indexSection.getBoundingClientRect();
        const span = r.height - window.innerHeight * 0.55;
        const p = span > 0 ? Math.max(0, Math.min(1, (window.innerHeight * 0.55 - r.top) / span)) : 0;
        indexMeter.style.width = (p * 100).toFixed(1) + '%';
      }
    }
    function requestScroll() {
      if (!ticking) { ticking = true; requestAnimationFrame(onScrollFrame); }
    }

    const hero = $('#home');
    const parallaxTargets = $$('[data-parallax]').map((el) => ({
      el,
      speed: parseFloat(el.dataset.parallax) || 0.1,
    }));

    window.addEventListener('scroll', requestScroll, { passive: true });
    window.addEventListener('resize', requestScroll);
    requestScroll();

    /* ══════════════════════════════════════════════════════
       5 · REVEAL ENGINE — CSS driven, IO triggered
       ══════════════════════════════════════════════════════ */
    // Split multi-line headings into masked lines
    $$('[data-reveal="lines"]').forEach((heading) => {
      const text = heading.textContent.trim();
      const words = text.split(/\s+/);
      const perLine = Math.max(2, Math.ceil(words.length / 2));
      heading.textContent = '';
      for (let i = 0; i < words.length; i += perLine) {
        const line = doc.createElement('span');
        line.className = 'line';
        const inner = doc.createElement('span');
        inner.className = 'line-in';
        inner.textContent = words.slice(i, i + perLine).join(' ');
        line.appendChild(inner);
        heading.appendChild(line);
      }
    });

    const revealables = $$('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.style.setProperty('--reveal-delay', (el.dataset.delay || 0) + 'ms');
          el.classList.add('is-in');
          io.unobserve(el);
        });
      }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

      revealables.forEach((el) => io.observe(el));
    } else {
      revealables.forEach((el) => el.classList.add('is-in'));
    }

    /* ══════════════════════════════════════════════════════
       6 · COUNT-UP STATISTICS
       ══════════════════════════════════════════════════════ */
    const counters = $$('.count');
    function runCount(el) {
      const target = parseFloat(el.dataset.count);
      if (Number.isNaN(target)) return;
      const pad = parseInt(el.dataset.pad || '0', 10);
      const fmt = (v) => String(v).padStart(pad, '0');
      if (reduceMotion) { el.textContent = fmt(target); return; }

      const duration = 1700;
      const start = performance.now();
      (function frame(now) {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 4);
        el.textContent = fmt(Math.round(target * eased));
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = fmt(target);
      })(start);
    }

    if ('IntersectionObserver' in window && counters.length) {
      const co = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runCount(entry.target);
          co.unobserve(entry.target);
        });
      }, { threshold: 0.4 });
      counters.forEach((el) => co.observe(el));
    } else {
      counters.forEach(runCount);
    }

    /* ══════════════════════════════════════════════════════
       7 · POINTER INTERACTIONS
       ══════════════════════════════════════════════════════ */
    if (finePointer && !reduceMotion) {
      // Magnetic buttons
      $$('[data-magnetic]').forEach((el) => {
        el.addEventListener('pointermove', (e) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) * 0.16;
          const dy = (e.clientY - (r.top + r.height / 2)) * 0.24;
          el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)';
        });
        el.addEventListener('pointerleave', () => { el.style.transform = ''; });
      });

      // Cursor-following record preview
      const preview = $('#row-preview');
      if (preview) {
        const pNum = $('.row-preview-num', preview);
        const pName = $('.row-preview-name', preview);
        const keys = Object.keys(sectionLabels);
        let px = 0, py = 0, tx = 0, ty = 0, raf = null, active = false;

        const loop = () => {
          px += (tx - px) * 0.16;
          py += (ty - py) * 0.16;
          preview.style.left = px + 'px';
          preview.style.top = py + 'px';
          raf = active ? requestAnimationFrame(loop) : null;
        };

        $$('.index-row').forEach((row) => {
          row.addEventListener('pointerenter', () => {
            const key = row.dataset.section;
            pNum.textContent = String(keys.indexOf(key) + 1).padStart(2, '0');
            pName.textContent = sectionLabels[key] || '';
            tx = px = row.getBoundingClientRect().right - 120;
            ty = py = row.getBoundingClientRect().top + row.offsetHeight / 2;
            active = true;
            preview.classList.add('is-visible');
            if (!raf) raf = requestAnimationFrame(loop);
          });
          row.addEventListener('pointermove', (e) => { tx = e.clientX + 24; ty = e.clientY; });
          row.addEventListener('pointerleave', () => {
            active = false;
            preview.classList.remove('is-visible');
          });
        });
      }

      // Custom cursor
      const cursor = $('#cursor');
      if (cursor) {
        const dot = $('.cursor-dot', cursor);
        const ring = $('.cursor-ring', cursor);
        let mx = -100, my = -100, rx = -100, ry = -100, running = false;

        const loop = () => {
          rx += (mx - rx) * 0.18;
          ry += (my - ry) * 0.18;
          dot.style.transform = 'translate(' + mx + 'px,' + my + 'px) translate(-50%,-50%)';
          ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px) translate(-50%,-50%)';
          running = requestAnimationFrame(loop);
        };
        window.addEventListener('pointermove', (e) => {
          if (e.pointerType !== 'mouse') return;
          mx = e.clientX; my = e.clientY;
          if (!running) { cursor.classList.add('is-active'); running = requestAnimationFrame(loop); }
        }, { passive: true });
        doc.addEventListener('pointerover', (e) => {
          const hot = e.target.closest('a, button, [data-section]');
          cursor.classList.toggle('is-hot', !!hot);
        });
      }
    }

    /* ══════════════════════════════════════════════════════
       8 · PORTRAIT BAND — the photograph lives at the top
       ══════════════════════════════════════════════════════ */
    let stopSculpture = null;

    const band = $('.portrait-band');
    const bandImg = $('.portrait-band-img');
    if (band && bandImg) {
      const good = () => band.classList.add('has-portrait');
      const missing = () => {
        bandImg.hidden = true;
        band.classList.add('no-portrait');
      };
      if (bandImg.complete) (bandImg.naturalWidth > 0 ? good() : missing());
      bandImg.addEventListener('load', good);
      bandImg.addEventListener('error', missing);
    }

    /* ══════════════════════════════════════════════════════
       9 · YEAR
       ══════════════════════════════════════════════════════ */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ══════════════════════════════════════════════════════
       10 · ENHANCEMENTS — loaded progressively, all optional
       ══════════════════════════════════════════════════════ */
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 900));

    function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = doc.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        doc.head.appendChild(s);
      });
    }

    idle(() => {
      // ── Smooth scrolling (Lenis). Native wheel/touch/keyboard
      //    behaviour is preserved; only the inertia is smoothed.
      if (reduceMotion) { initSculpture(); return; }
      loadScript('https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js')
        .then(() => {
          if (typeof window.Lenis !== 'function') return;
          lenis = new window.Lenis({
            duration: 1.05,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
          });
          doc.documentElement.classList.add('lenis');
          const raf = (time) => { lenis.raf(time); requestAnimationFrame(raf); };
          requestAnimationFrame(raf);
        })
        .catch(() => { /* native scrolling stays */ })
        .finally(initSculpture);
    });

    /* ══════════════════════════════════════════════════════
       11 · HERO SCULPTURE — Three.js, only where it counts
       ══════════════════════════════════════════════════════ */
    function initSculpture() {
      const canvas = $('#hero-canvas');
      if (!canvas || reduceMotion) return;

      const probe = doc.createElement('canvas');
      const gl = probe.getContext('webgl') || probe.getContext('experimental-webgl');
      if (!gl) return; // no WebGL → the framed placeholder remains

      loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js')
        .then(() => {
          if (typeof window.THREE !== 'object') return;
          buildScene(canvas);
        })
        .catch(() => { /* placeholder remains */ });
    }

    function buildScene(canvas) {
      const THREE = window.THREE;
      const frame = canvas.parentElement;

      const small = window.matchMedia('(max-width: 700px)').matches;

      const renderer = new THREE.WebGLRenderer({
        canvas, alpha: true, antialias: !small, powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.6));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60);
      camera.position.set(0, 0, 4.9);

      // Lighting — warm key, cool fill, so the form reads sculptural
      scene.add(new THREE.AmbientLight(0x1b262a, 1.1));
      const key = new THREE.DirectionalLight(0xff7a00, 2.6);
      key.position.set(2.6, 2.8, 2.4);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0x9fb4c8, 0.85);
      fill.position.set(-2.8, -1.1, 1.6);
      scene.add(fill);
      const rim = new THREE.PointLight(0xffd0a0, 1.1, 12);
      rim.position.set(0, 0.4, -2.6);
      scene.add(rim);

      const sculpture = new THREE.Group();
      scene.add(sculpture);

      // The form
      const knot = new THREE.Mesh(
        new THREE.TorusKnotGeometry(0.84, 0.255, small ? 110 : 200, small ? 18 : 32, 2, 3),
        new THREE.MeshStandardMaterial({ color: 0x121b1e, metalness: 0.74, roughness: 0.33 })
      );
      sculpture.add(knot);

      // Outer wireframe shell — reads as a second, slower layer
      const shell = new THREE.Mesh(
        new THREE.IcosahedronGeometry(1.66, 1),
        new THREE.MeshBasicMaterial({
          color: 0xff7a00, wireframe: true, transparent: true, opacity: 0.13,
        })
      );
      sculpture.add(shell);

      // Atmospheric dust
      const DUST_COUNT = small ? 130 : 240;
      const dustGeo = new THREE.BufferGeometry();
      const pos = new Float32Array(DUST_COUNT * 3);
      for (let i = 0; i < DUST_COUNT; i++) {
        const r = 1.9 + Math.random() * 1.5;
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        pos[i * 3]     = r * Math.sin(ph) * Math.cos(th);
        pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
        pos[i * 3 + 2] = r * Math.cos(ph) * 0.55;
      }
      dustGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({
        color: 0xffa04d, size: 0.017, transparent: true, opacity: 0.55, depthWrite: false,
      }));
      scene.add(dust);

      // Pointer parallax
      let px = 0, py = 0, tx = 0, ty = 0;
      window.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse') return;
        tx = (e.clientX / window.innerWidth - 0.5) * 0.5;
        ty = (e.clientY / window.innerHeight - 0.5) * 0.35;
      }, { passive: true });

      function resize() {
        const w = frame.clientWidth, h = frame.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
      resize();
      window.addEventListener('resize', resize);
      if ('ResizeObserver' in window) new ResizeObserver(resize).observe(frame);

      heroVisual.classList.add('has-webgl');

      let visible = true;
      if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
          visible = entries[0].isIntersecting;
        }, { threshold: 0.02 }).observe(frame);
      }
      doc.addEventListener('visibilitychange', () => { visible = !doc.hidden; });

      // Intro settle
      sculpture.scale.setScalar(0.82);
      let introT = 0;

      const clock = new THREE.Clock();
      let running = true;
      stopSculpture = () => { running = false; };

      (function animate() {
        if (!running) return;
        requestAnimationFrame(animate);
        if (!visible) return;

        const t = clock.getElapsedTime();
        px += (tx - px) * 0.045;
        py += (ty - py) * 0.045;

        knot.rotation.x = t * 0.16;
        knot.rotation.y = t * 0.23;
        shell.rotation.y = -t * 0.09;
        shell.rotation.z = t * 0.05;
        dust.rotation.y = t * 0.035;

        sculpture.rotation.y = px * 0.9;
        sculpture.rotation.x = -py * 0.7 + Math.sin(t * 0.5) * 0.06;
        sculpture.position.y = Math.sin(t * 0.62) * 0.055;

        introT = Math.min(1, introT + 0.02);
        const ease = 1 - Math.pow(1 - introT, 4);
        sculpture.scale.setScalar(0.82 + ease * 0.18);

        renderer.render(scene, camera);
      })();
    }

  } catch (err) {
    // Anything unexpected → show the finished design, never a blank page
    console.error('Site script error:', err);
    doc.documentElement.classList.remove('no-scroll');
    forceRevealAll();
  }
})();

/* Studio Bright - main.js
   Vanilla, deferred, feature-detected, no globals. Every module is independent:
   if one throws or its markup is missing, the rest still run and the page stays usable.
   Modules: theme toggle, mobile nav (focus + inert), reveal on scroll, motion control ("Pause animations"),
   pause off-screen animation, project filters, copy email, ride route (signature).
   The inline head script has already set html.js, data-theme and html.motion-off. This file adds html.ready as its
   first act: until then a CSS failsafe reveals content on its own (see section 16 of site.css). If this file never
   loads, the onerror attribute on its script tag removes html.js and the page falls back to the plain no-JS state. */
(function () {
  'use strict';

  var d = document;
  var root = d.documentElement;
  var win = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var mq = function (q) { return win.matchMedia ? win.matchMedia(q) : { matches: false, addEventListener: function () {} }; };
  var reduceMq = mq('(prefers-reduced-motion: reduce)');
  /* True when nothing may move by itself: the OS asks for reduced motion or the visitor pressed "Pause animations". */
  var isMotionOff = function () { return reduceMq.matches || root.classList.contains('motion-off'); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var safe = function (fn) { try { fn(); } catch (e) { /* a broken module must never break the page */ } };

  root.classList.add('ready');

  /* ---- Theme ------------------------------------------------------------ */
  function initTheme() {
    var btn = $('.theme-toggle');
    if (!btn) return;
    var metas = $$('meta[name="theme-color"]');
    var colors = { light: '#f4efe6', dark: '#0f0d0b' };
    var apply = function (t, persist) {
      root.setAttribute('data-theme', t);
      btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
      if (persist) { try { localStorage.setItem('theme', t); } catch (e) {} }
      metas.forEach(function (m) { m.removeAttribute('media'); m.setAttribute('content', colors[t]); });
    };
    btn.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark' ? 'true' : 'false');
    btn.addEventListener('click', function () {
      apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark', true);
    });
    /* Follow the OS while the visitor has not chosen a theme themselves. */
    var sys = mq('(prefers-color-scheme: dark)');
    if (sys.addEventListener) sys.addEventListener('change', function (e) {
      var saved = null;
      try { saved = localStorage.getItem('theme'); } catch (err) {}
      if (!saved) apply(e.matches ? 'dark' : 'light', false);
    });
  }

  /* ---- Mobile navigation: disclosure pattern -------------------------------
     Below 1100px (with JS) the links sit in a panel under the header. Opening it moves focus to the first link; while it is
     open <main> and the footer are inert, so Tab cannot wander into the page behind it; Escape (or a click outside, or a
     link) closes it and Escape hands focus back to the menu button. Without JS the same links are a plain visible list. */
  function initNav() {
    var btn = $('.nav-toggle');
    var nav = $('#site-nav');
    if (!btn || !nav) return;
    var behind = $$('main, .site-footer');
    var isOpen = function () { return btn.getAttribute('aria-expanded') === 'true'; };
    var set = function (open) {
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Menu');
      nav.classList.toggle('is-open', open);
      behind.forEach(function (el) { if (open) el.setAttribute('inert', ''); else el.removeAttribute('inert'); });
    };
    btn.addEventListener('click', function () {
      var open = !isOpen();
      set(open);
      /* The panel sits before the buttons in the DOM (desktop order), so hand focus to its first link. */
      if (open) { var first = $('a', nav); if (first) first.focus(); }
    });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen()) { set(false); btn.focus(); }
    });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    d.addEventListener('click', function (e) {
      if (isOpen() && !nav.contains(e.target) && !btn.contains(e.target)) set(false);
    });
    var wide = mq('(min-width: 1100px)');
    if (wide.addEventListener) wide.addEventListener('change', function () { set(false); });
    win.addEventListener('pageshow', function (e) { if (e.persisted) set(false); });   /* back/forward cache restores the page as it was left */
  }

  /* ---- Reveal on scroll --------------------------------------------------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!els.length) return;
    /* Always observe, even when motion is off: the CSS only hides un-revealed content while motion is allowed, so marking
       elements is harmless then, and it keeps everything correct if the visitor un-pauses animations later. */
    if (!('IntersectionObserver' in win)) {
      els.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---- Motion control: "Pause animations" (WCAG 2.2.2) ------------------------
     Every [data-motion-toggle] button is a toggle (aria-pressed="true" = paused). The state is html.motion-off, kept in
     localStorage "motion" ("paused") and applied by the head script before first paint. An OS request for reduced motion
     shows the button pressed and disabled. CSS switches off every loop, ping and reveal; the route reads isMotionOff()
     and listens to the "motionchange" event on window. */
  function initMotion() {
    var btns = $$('[data-motion-toggle]');
    var note = 'Animations are already off because your device asks for reduced motion.';
    var sync = function () {
      var forced = reduceMq.matches, on = forced || root.classList.contains('motion-off');
      btns.forEach(function (b) {
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
        b.disabled = forced;
        if (forced) b.setAttribute('title', note); else b.removeAttribute('title');
      });
    };
    var announce = function () {
      sync();
      try { win.dispatchEvent(new CustomEvent('motionchange', { detail: { off: isMotionOff() } })); } catch (e) { /* old engines */ }
    };
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var pause = !root.classList.contains('motion-off');
        root.classList.toggle('motion-off', pause);
        try { if (pause) localStorage.setItem('motion', 'paused'); else localStorage.removeItem('motion'); } catch (e) { /* storage blocked: the choice lasts for this page view */ }
        announce();
      });
    });
    if (reduceMq.addEventListener) reduceMq.addEventListener('change', announce);
    /* A hidden tab does not need running animations; the class also pauses what CSS animates (see section 16). */
    d.addEventListener('visibilitychange', function () { root.classList.toggle('tab-hidden', d.hidden); });
    sync();
  }

  /* ---- Pause looping animation while it is off-screen ----------------------
     The marquee simply pauses. The rotating role word restarts from its first word
     whenever the hero scrolls back into view, so the h1 always opens on "Quant developer". */
  function initPause() {
    if (!('IntersectionObserver' in win)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (el.classList.contains('hero-grid') && en.isIntersecting && el.classList.contains('is-paused')) {
          el.classList.add('is-restart');
          void el.offsetWidth;               /* flush styles so the animation really restarts */
          el.classList.remove('is-restart');
        }
        el.classList.toggle('is-paused', !en.isIntersecting);
      });
    });
    /* .hero-grid, not .hero-copy: on phones the copy is display:contents (no box, so an observer would never see it). */
    ['.hero-grid', '.strips'].forEach(function (s) { var el = $(s); if (el) io.observe(el); });
  }

  /* ---- Project filters (buttons with aria-pressed) --------------------------- */
  function initFilters() {
    var bar = $('.filters');
    var grid = $('#project-grid');
    var status = $('#filter-status');
    if (!bar || !grid) return;
    var cards = $$('.project', grid);
    var btns = $$('.filter', bar);
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('.filter');
      if (!b) return;
      var f = b.getAttribute('data-filter');
      var shown = 0;
      btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cat') === f;
        c.hidden = !show;
        if (show) { shown++; c.classList.add('is-in'); }
      });
      if (status) {
        var name = b.firstChild ? b.firstChild.textContent.trim() : f;
        status.textContent = 'Showing ' + shown + (shown === 1 ? ' project' : ' projects') + (f === 'all' ? '' : ' in ' + name) + '.';
      }
    });
  }

  /* ---- Copy email ------------------------------------------------------------ */
  function initCopy() {
    var btn = $('[data-copy]');
    if (!btn) return;
    var label = $('.copy-label', btn);
    var status = $('#copy-status');
    var src = $('#copy-email');
    var timer;
    var finish = function (ok) {
      btn.classList.toggle('is-copied', ok);
      if (label) label.textContent = ok ? 'Copied' : 'Select and copy';
      if (status) status.textContent = ok ? 'Email address copied to the clipboard.' : 'Press Control or Command plus C to copy.';
      clearTimeout(timer);
      timer = setTimeout(function () {
        btn.classList.remove('is-copied');
        if (label) label.textContent = 'Copy email';
      }, 2400);
    };
    var fallback = function () {
      try {
        var r = d.createRange(); r.selectNodeContents(src);
        var s = win.getSelection(); s.removeAllRanges(); s.addRange(r);
        finish(!!d.execCommand('copy'));
      } catch (e) { finish(false); }
    };
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      if (navigator.clipboard && win.isSecureContext) navigator.clipboard.writeText(text).then(function () { finish(true); }, fallback);
      else fallback();
    });
  }

  /* ---- Ride route (signature) ------------------------------------------------
     The page is a long ride. We measure each section label ([data-route]) and build
     one SVG path: down the left gutter, a switchback across the page in the white
     space between sections, down the right gutter, and so on, ending at Contact.
     The ridden part is stroked with a dash offset driven by scroll position; a
     GPS-style marker rides the tip and waypoint pins light up as it passes them.
     Decorative only (aria-hidden); without JS or with reduced motion it is static.
     Performance: geometry is measured on a small JS polyline (no getPointAtLength
     calls), the build is skipped when the layout signature has not changed, and it
     runs after first paint so it never competes with LCP. */
  function initRoute() {
    var svg = $('.route');
    var main = $('#main');
    if (!svg || !main || !win.SVGPathElement) return;
    var NS = 'http://www.w3.org/2000/svg';
    var mk = function (tag, attrs, parent) {
      var el = d.createElementNS(NS, tag);
      for (var k in attrs) el.setAttribute(k, attrs[k]);
      (parent || svg).appendChild(el);
      return el;
    };
    var CURVE_STEPS = 24;

    var m = null;        /* current measurement */
    var sig = '';        /* layout signature of the last build */
    var raf = 0;
    var lastOff = -1;

    function build() {
      var labels = $$('[data-route]', main);
      if (labels.length < 2) return;
      var mr = main.getBoundingClientRect();
      var W = Math.round(mr.width);
      var H = Math.round(mr.height);
      var rel = function (el) { var r = el.getBoundingClientRect(); return { top: r.top - mr.top, bottom: r.bottom - mr.top, left: r.left - mr.left, mid: (r.top + r.bottom) / 2 - mr.top }; };
      var small = W < 1100;                                  /* thin road in the narrow gutters of phones and tablets (CSS: home.css section 5) */
      var box = $('.container', main);
      var left = rel(box).left;
      var tight = !small && left < 56;                       /* narrow gutters: hug the edge, smaller pins */
      var gx = small ? 9 : tight ? Math.max(14, left - 22) : Math.max(24, left - 32);   /* road centre: clear of the 6px card shadows on both sides */
      var xs = [gx, W - gx];

      /* Stops: one per label, alternating sides, starting on the left. */
      var stops = labels.map(function (el, i) {
        var sec = el.closest('section');
        var content = sec.classList.contains('hero') ? $('.strips', sec) : $$('.container', sec).pop();
        var r = rel(el);
        return { y: r.mid, top: r.top, x: xs[i % 2], bottom: content ? rel(content).bottom : rel(sec).bottom };
      });

      var signature = W + 'x' + H + ':' + stops.map(function (st) { return Math.round(st.y); }).join(',');
      if (signature === sig && m) return;
      sig = signature;

      /* SVG path (exact curves) + a measuring polyline (y never decreases). */
      var p = 'M' + stops[0].x + ' ' + stops[0].y.toFixed(1);
      var px = [stops[0].x], py = [stops[0].y];
      for (var i = 0; i < stops.length - 1; i++) {
        var a = stops[i], b = stops[i + 1];
        var gap = Math.max(60, b.top - a.bottom);   /* white space between the two sections' content */
        var cs = a.bottom + gap * 0.2;
        var ce = Math.min(a.bottom + gap * 0.8, b.y - 24);
        var ym = (cs + ce) / 2;
        p += ' L' + a.x + ' ' + cs.toFixed(1) +
             ' C' + a.x + ' ' + ym.toFixed(1) + ' ' + b.x + ' ' + ym.toFixed(1) + ' ' + b.x + ' ' + ce.toFixed(1) +
             ' L' + b.x + ' ' + b.y.toFixed(1);
        px.push(a.x); py.push(cs);
        for (var k = 1; k <= CURVE_STEPS; k++) {
          var t = k / CURVE_STEPS, u = 1 - t;
          px.push(u * u * u * a.x + 3 * u * u * t * a.x + 3 * u * t * t * b.x + t * t * t * b.x);
          py.push(u * u * u * cs + 3 * u * u * t * ym + 3 * u * t * t * ym + t * t * t * ce);
        }
        px.push(b.x); py.push(b.y);
      }
      var n = px.length;
      var len = new Float32Array(n);
      for (var j = 1; j < n; j++) len[j] = len[j - 1] + Math.sqrt(Math.pow(px[j] - px[j - 1], 2) + Math.pow(py[j] - py[j - 1], 2));
      var total = len[n - 1];

      /* y -> {x, length along the path} by binary search + interpolation */
      var at = function (y) {
        var lo = 0, hi = n - 1;
        while (lo < hi) { var mid = (lo + hi) >> 1; if (py[mid] < y) lo = mid + 1; else hi = mid; }
        if (lo === 0) return { x: px[0], l: 0 };
        var f = py[lo] === py[lo - 1] ? 0 : (y - py[lo - 1]) / (py[lo] - py[lo - 1]);
        return { x: px[lo - 1] + (px[lo] - px[lo - 1]) * f, l: len[lo - 1] + (len[lo] - len[lo - 1]) * f };
      };

      while (svg.firstChild) svg.removeChild(svg.firstChild);
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      svg.setAttribute('width', W);
      svg.setAttribute('height', H);
      mk('path', { 'class': 'route-ghost', d: p });
      var ridden = mk('g', { 'class': 'route-ridden' });
      mk('path', { 'class': 'route-halo', d: p, pathLength: 1000 }, ridden);
      mk('path', { 'class': 'route-case', d: p, pathLength: 1000 }, ridden);
      mk('path', { 'class': 'route-core', d: p, pathLength: 1000 }, ridden);

      /* The outer group carries the position; the inner group is what scales when a pin is reached
         (a CSS transform on the same element would replace the translate attribute). */
      var pinR = small ? 6 : tight ? 8 : 10;
      var pins = stops.map(function (st, kk) {
        var outer = mk('g', { transform: 'translate(' + st.x + ' ' + st.y.toFixed(1) + ')' });
        var inner = mk('g', { 'class': 'route-pin' + (kk === stops.length - 1 ? ' route-pin--end' : '') }, outer);
        mk('circle', { 'class': 'pin-ring', r: pinR }, inner);
        mk('circle', { 'class': 'pin-dot', r: pinR * 0.45 }, inner);
        return { el: inner, len: at(st.y).l };
      });

      var rider = mk('g', { 'class': 'route-rider' });
      var rs = small ? 0.7 : 1;
      mk('circle', { 'class': 'rider-pulse', r: small ? 7 : 13 }, rider);
      mk('circle', { 'class': 'rider-body', r: 9 * rs }, rider);
      mk('circle', { 'class': 'rider-ring', r: 4 * rs }, rider);

      m = { ridden: ridden, rider: rider, pins: pins, total: total, at: at, y0: stops[0].y, y1: stops[stops.length - 1].y, top: mr.top + (win.pageYOffset || 0) };   /* page-space top of <main>: scrolling needs no layout read */
      lastOff = -1;
      update();
    }

    function update() {
      raf = 0;
      if (!m) return;
      var f = 1, x = 0, y = m.y1;
      var still = isMotionOff();                          /* reduced motion or paused: the road is fully drawn, no rider */
      if (!still) {
        var raw = (win.pageYOffset || 0) - m.top + win.innerHeight * 0.6;
        y = clamp(raw, m.y0, m.y1);
        var pt = m.at(y);
        f = raw < m.y0 ? 0 : pt.l / m.total;
        x = pt.x;
      }
      var off = 1000 * (1 - f);
      if (Math.abs(off - lastOff) < 0.25) return;
      lastOff = off;
      m.ridden.style.strokeDashoffset = off.toFixed(2);
      if (!still) {
        m.rider.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ')');
        m.rider.style.opacity = f <= 0.001 ? 0 : 1;
      }
      var cur = f * m.total;
      m.pins.forEach(function (pin) { pin.el.classList.toggle('is-reached', cur >= pin.len - 1); });
    }

    var schedule = function () { if (!raf) raf = win.requestAnimationFrame(update); };
    var onScroll = function () { if (!isMotionOff()) schedule(); };    /* a still road (paused / reduced motion) is redrawn only on resize or "motionchange" */
    var timer = 0;
    var rebuild = function (delay) { clearTimeout(timer); timer = setTimeout(function () { safe(build); }, delay); };

    /* After first paint, when the browser is idle; later rebuilds are debounced and skipped if nothing moved. */
    var first = function () { rebuild(0); };
    if (win.requestIdleCallback) win.requestIdleCallback(first, { timeout: 1200 }); else setTimeout(first, 200);
    win.addEventListener('scroll', onScroll, { passive: true });
    win.addEventListener('motionchange', function () { lastOff = -1; schedule(); });   /* paused / resumed: redraw once */
    win.addEventListener('resize', function () { rebuild(150); }, { passive: true });
    win.addEventListener('load', function () { rebuild(120); });
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { rebuild(60); });
    if ('ResizeObserver' in win) new ResizeObserver(function () { rebuild(200); }).observe(main);
  }

  safe(initTheme);
  safe(initNav);
  safe(initReveal);
  safe(initMotion);
  safe(initPause);
  safe(initFilters);
  safe(initCopy);
  safe(initRoute);
})();

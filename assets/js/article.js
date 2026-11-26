/* Studio Bright - article.js: progress bar, contents highlight, code copy, scroll regions, blog filter. Every module is guarded; pages work without it. */
(function () {
  'use strict';
  var d = document, w = window;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || d).querySelectorAll(s)); };
  var run = function (fn) { try { fn(); } catch (e) { /* never break the page */ } };
  var on = function (el, ev, fn) { el.addEventListener(ev, fn, { passive: true }); };

  /* Reading progress bar (transform only) */
  function progress() {
    var sheet = $('.post-sheet');
    if (!sheet) return;
    var bar = d.createElement('div'), fill, busy = false;
    bar.className = 'read-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.innerHTML = '<span></span>';
    fill = bar.firstChild;
    d.body.appendChild(bar);
    var update = function () {
      var r = sheet.getBoundingClientRect(), span = r.height - w.innerHeight * 0.55;
      busy = false;
      fill.style.transform = 'scaleX(' + (span > 0 ? Math.max(0, Math.min(1, (w.innerHeight * 0.2 - r.top) / span)) : 1).toFixed(4) + ')';
    };
    var tick = function () { if (!busy) { busy = true; w.requestAnimationFrame(update); } };
    on(w, 'scroll', tick);
    update();
  }

  /* Contents: mark the section being read */
  function contents() {
    var links = $$('.toc a[href^="#"]'), heads = [], seen = {}, rail = $('.toc-rail'), current = '';
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1), el = d.getElementById(id);
      if (el && !seen[id]) { seen[id] = 1; heads.push(el); }
    });
    if (!heads.length) return;
    var pick = function () {
      var id = heads[0].id, i;
      for (i = 0; i < heads.length && heads[i].getBoundingClientRect().top <= w.innerHeight * 0.34; i++) id = heads[i].id;
      if (id === current) return;
      current = id;
      links.forEach(function (a) {
        var hit = a.getAttribute('href') === '#' + id;
        a.classList.toggle('is-active', hit);
        if (hit) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
      });
      var act = rail && $('.is-active', rail);
      if (act && rail.scrollHeight > rail.clientHeight) rail.scrollTop = act.offsetTop - rail.clientHeight / 2;
    };
    if ('IntersectionObserver' in w) {                       /* fires when a heading crosses the reading band */
      var io = new IntersectionObserver(pick, { rootMargin: '-96px 0px -66% 0px' });
      heads.forEach(function (h) { io.observe(h); });
    }
    pick();
  }

  /* Copy buttons on code listings */
  function copy() {
    var cards = $$('.code-card'), live;
    if (!cards.length) return;
    live = d.createElement('p');
    live.className = 'visually-hidden';
    live.setAttribute('role', 'status');
    d.body.appendChild(live);
    cards.forEach(function (card) {
      var bar = $('.code-bar', card), pre = $('pre', card), btn = d.createElement('button'), timer;
      if (!bar || !pre) return;
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = 'Copy';
      btn.setAttribute('aria-label', 'Copy code: ' + (pre.getAttribute('data-title') || 'listing'));
      bar.appendChild(btn);
      var done = function (ok) {
        btn.classList.toggle('is-copied', ok);
        btn.textContent = ok ? 'Copied' : 'Press Ctrl+C';
        live.textContent = ok ? 'Code copied.' : 'Copy failed: select the code and press Control or Command plus C.';
        clearTimeout(timer);
        timer = setTimeout(function () { btn.classList.remove('is-copied'); btn.textContent = 'Copy'; }, 2200);
      };
      var fallback = function () {
        try {
          var r = d.createRange(), s = w.getSelection();
          r.selectNodeContents(pre);
          s.removeAllRanges();
          s.addRange(r);
          done(!!d.execCommand('copy'));
        } catch (e) { done(false); }
      };
      btn.addEventListener('click', function () {
        if (navigator.clipboard && w.isSecureContext) navigator.clipboard.writeText(pre.textContent).then(function () { done(true); }, fallback);
        else fallback();
      });
    });
  }

  /* Scroll regions (figures, tables, code, equations): focusable and named only while they overflow */
  function scrollers() {
    var els = $$('.scroll-x');
    var nameOf = function (el) {
      var t = el.closest('.fig') ? $('svg title', el) : $('caption', el) || $('.eq-label', el);
      if (el.closest('.fig')) return 'Figure: ' + (t ? t.textContent.trim() : 'diagram');
      if (el.tagName === 'PRE') return 'Code: ' + (el.getAttribute('data-title') || 'listing');
      return t ? t.textContent.trim().slice(0, 70) : 'Scrollable content';
    };
    var check = function (el) {
      var over = el.scrollWidth > el.clientWidth + 1;
      if (over && !el.hasAttribute('tabindex')) {
        el.tabIndex = 0;
        el.setAttribute('role', 'region');
        el.setAttribute('aria-label', nameOf(el));
        el.setAttribute('data-xs', '1');
      } else if (!over && el.hasAttribute('data-xs')) {
        ['tabindex', 'role', 'aria-label', 'data-xs'].forEach(function (a) { el.removeAttribute(a); });
      }
    };
    var all = function () { els.forEach(check); };
    if ('ResizeObserver' in w) { var ro = new ResizeObserver(all); els.forEach(function (el) { ro.observe(el); }); }
    on(w, 'resize', all);
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(all);
    all();
  }

  /* Blog index topic chips (aria-pressed); without JavaScript every card stays visible */
  function filter() {
    var bar = $('.tag-filters'), grid = $('#blog-grid');
    if (!bar || !grid) return;
    var cards = $$('.bcard', grid), btns = $$('.tag-filter', bar), status = $('#blog-status');
    var apply = function (tag, save) {
      var n = 0, hit = btns.filter(function (b) { return b.getAttribute('data-filter') === tag; })[0];
      btns.forEach(function (b) { b.setAttribute('aria-pressed', b === hit ? 'true' : 'false'); });
      cards.forEach(function (c) { var show = tag === 'all' || c.getAttribute('data-tag') === tag; c.hidden = !show; n += show ? 1 : 0; });
      if (status) status.textContent = 'Showing ' + n + (n === 1 ? ' article' : ' articles') + (tag === 'all' ? '' : ' about ' + tag) + '.';
      if (save && hit && history.replaceState) history.replaceState(null, '', tag === 'all' ? location.pathname : '#' + hit.id);
    };
    bar.addEventListener('click', function (e) { var b = e.target.closest('.tag-filter'); if (b) apply(b.getAttribute('data-filter'), true); });
    var start = btns.filter(function (b) { return b.id === location.hash.slice(1); })[0];
    if (start && start.id !== 'tag-all') apply(start.getAttribute('data-filter'), false);
  }

  [progress, contents, copy, scrollers, filter].forEach(run);
})();

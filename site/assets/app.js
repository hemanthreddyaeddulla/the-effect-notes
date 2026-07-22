/* The Effect — notes: theme, search, progress, TOC scrollspy, review deck.
   Vanilla JS, no build step, no dependencies. */
(function () {
  'use strict';

  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };

  /* ---------------- theme ---------------- */
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var cur = document.documentElement.dataset.theme;
      if (!cur) cur = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      var next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.dataset.theme = next;
      try { localStorage.setItem('effect-theme', JSON.stringify(next).slice(1, -1)); } catch (e) {}
    });
  }
  // stored raw (not JSON) by the inline head script; normalise both shapes
  try {
    var t = localStorage.getItem('effect-theme');
    if (t) document.documentElement.dataset.theme = t.replace(/"/g, '');
  } catch (e) {}

  /* ---------------- learned progress ---------------- */
  var LEARNED = 'effect-learned';
  function learnedSet() { var a = LS.get(LEARNED, []); return Array.isArray(a) ? a : []; }

  var doneBtn = document.querySelector('.btn-done');
  if (doneBtn) {
    var ep = +doneBtn.dataset.ep;
    var paint = function () {
      var on = learnedSet().indexOf(ep) !== -1;
      doneBtn.classList.toggle('on', on);
      doneBtn.textContent = on ? '✓ Learned' : 'Mark as learned';
    };
    doneBtn.addEventListener('click', function () {
      var a = learnedSet(), i = a.indexOf(ep);
      if (i === -1) a.push(ep); else a.splice(i, 1);
      LS.set(LEARNED, a);
      paint();
    });
    paint();
  }

  var epItems = document.querySelectorAll('.ep-item[data-ep]');
  if (epItems.length) {
    var set = learnedSet();
    epItems.forEach(function (li) { if (set.indexOf(+li.dataset.ep) !== -1) li.classList.add('learned'); });
    var lc = document.getElementById('learned-count');
    if (lc) lc.textContent = set.length;
  }

  /* ---------------- TOC scrollspy ---------------- */
  var tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length && 'IntersectionObserver' in window) {
    var map = {};
    tocLinks.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var a = map[e.target.id];
        if (!a) return;
        if (e.isIntersecting) {
          tocLinks.forEach(function (x) { x.classList.remove('active'); });
          a.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -70% 0px', threshold: 0 });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }

  /* ---------------- search ---------------- */
  var modal = document.getElementById('search-modal');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var openBtn = document.getElementById('search-open');
  var index = null, sel = 0;

  function loadIndex(cb) {
    if (index) return cb();
    fetch('search.json').then(function (r) { return r.json(); }).then(function (j) { index = j; cb(); })
      .catch(function () { index = []; cb(); });
  }
  function openSearch() {
    if (!modal) return;
    modal.hidden = false;
    loadIndex(function () { input.focus(); input.select(); render(input.value); });
  }
  function closeSearch() { if (modal) modal.hidden = true; }

  function render(q) {
    if (!results) return;
    q = (q || '').trim().toLowerCase();
    if (!q) { results.innerHTML = '<div class="sr-empty">Type to search all written notes.</div>'; return; }
    var terms = q.split(/\s+/);
    var hits = (index || []).map(function (d) {
      var hay = (d.title + ' ' + d.chapterTitle + ' ' + d.one + ' ' + d.text).toLowerCase();
      var score = 0;
      for (var i = 0; i < terms.length; i++) {
        if (hay.indexOf(terms[i]) === -1) return null;
        if (d.title.toLowerCase().indexOf(terms[i]) !== -1) score += 12;
        if (d.one.toLowerCase().indexOf(terms[i]) !== -1) score += 5;
        score += 1;
      }
      return { d: d, score: score };
    }).filter(Boolean).sort(function (a, b) { return b.score - a.score; }).slice(0, 12);

    if (!hits.length) { results.innerHTML = '<div class="sr-empty">No matches.</div>'; return; }
    sel = 0;
    results.innerHTML = hits.map(function (h, i) {
      return '<a class="sr' + (i === 0 ? ' sel' : '') + '" href="' + h.d.slug + '.html">' +
        '<b>Ep ' + h.d.ep + ' · ' + escapeHtml(h.d.title) + '</b>' +
        '<small>' + escapeHtml(h.d.one || h.d.chapterTitle) + '</small></a>';
    }).join('');
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }

  if (openBtn) openBtn.addEventListener('click', openSearch);
  if (input) input.addEventListener('input', function () { render(input.value); });
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeSearch(); });

  document.addEventListener('keydown', function (e) {
    var typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (e.key === '/' && !typing) { e.preventDefault(); openSearch(); return; }
    if (e.key === 'Escape') { closeSearch(); return; }
    if (modal && !modal.hidden && (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter')) {
      var items = results.querySelectorAll('.sr');
      if (!items.length) return;
      if (e.key === 'Enter') { e.preventDefault(); items[sel].click(); return; }
      e.preventDefault();
      items[sel].classList.remove('sel');
      sel = (sel + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length;
      items[sel].classList.add('sel');
      items[sel].scrollIntoView({ block: 'nearest' });
    }
    if (!typing && (e.key === 'j' || e.key === 'k')) {
      var target = document.querySelector(e.key === 'j' ? '.pg.next' : '.pg.prev');
      if (target && target.tagName === 'A') target.click();
    }
  });

  /* ---------------- glossary filter ---------------- */
  var gf = document.getElementById('gfilter');
  if (gf) {
    gf.addEventListener('input', function () {
      var q = gf.value.trim().toLowerCase();
      document.querySelectorAll('.glossary.big > div').forEach(function (d) {
        d.style.display = !q || d.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  /* ---------------- review deck (leitner-style scheduler) ---------------- */
  var rv = document.getElementById('rv-app');
  if (rv) {
    var SRS = 'effect-srs';
    var DAY = 86400000;
    var STEPS = [0, 1, 3, 7, 16, 35, 90];   // days until next sighting, by box

    fetch('cards.json').then(function (r) { return r.json(); }).then(function (cards) {
      if (!cards.length) {
        rv.innerHTML = '<div class="rv-done"><b>No cards yet.</b>Write some episode notes first.</div>';
        return;
      }
      var state = LS.get(SRS, {});
      var now = Date.now();

      cards.forEach(function (c, i) { c.key = c.ep + ':' + i; });

      function due(c) {
        var s = state[c.key];
        return !s || s.due <= now;
      }
      var queue = cards.filter(due);
      // Oldest-due first, then unseen, then by episode — keeps the order meaningful.
      queue.sort(function (a, b) {
        var sa = state[a.key], sb = state[b.key];
        if (!sa && sb) return -1;
        if (sa && !sb) return 1;
        if (sa && sb) return sa.due - sb.due;
        return a.ep - b.ep;
      });

      document.getElementById('rv-total').textContent = cards.length;
      document.getElementById('rv-due').textContent = queue.length;
      document.getElementById('rv-new').textContent = cards.filter(function (c) { return !state[c.key]; }).length;

      var pos = 0;
      function show() {
        if (pos >= queue.length) {
          rv.innerHTML = '<div class="rv-done"><b>Deck clear.</b>Nothing due right now. Come back after the next episode.</div>';
          document.getElementById('rv-due').textContent = 0;
          return;
        }
        var c = queue[pos];
        rv.innerHTML =
          '<div class="rv-card">' +
          '<div class="rv-src">Ep ' + c.ep + ' · <a href="' + c.slug + '.html">' + escapeHtml(c.title) + '</a> · ' + (pos + 1) + ' of ' + queue.length + '</div>' +
          '<p class="rv-q">' + c.q + '</p>' +
          '<button class="btn" id="rv-reveal">Show answer <small style="opacity:.6">space</small></button>' +
          '<div class="rv-a" id="rv-ans" hidden>' + mdish(c.a) + '</div>' +
          '<div class="rv-actions" id="rv-grades" hidden>' +
          '<button class="rv-grade" data-g="0">Again<small>didn\'t have it</small></button>' +
          '<button class="rv-grade" data-g="1">Hard<small>got there slowly</small></button>' +
          '<button class="rv-grade" data-g="2">Good<small>instant</small></button>' +
          '</div></div>';

        document.getElementById('rv-reveal').addEventListener('click', reveal);
        rv.querySelectorAll('.rv-grade').forEach(function (b) {
          b.addEventListener('click', function () { grade(+b.dataset.g); });
        });
      }
      function reveal() {
        var a = document.getElementById('rv-ans'), g = document.getElementById('rv-grades'), r = document.getElementById('rv-reveal');
        if (!a || a.hidden === false) return;
        a.hidden = false; g.hidden = false; if (r) r.style.display = 'none';
      }
      function grade(g) {
        var c = queue[pos];
        var s = state[c.key] || { box: 0 };
        if (g === 0) s.box = 0;
        else if (g === 1) s.box = Math.max(1, s.box);
        else s.box = Math.min(STEPS.length - 1, s.box + 1);
        s.due = Date.now() + STEPS[s.box] * DAY;
        state[c.key] = s;
        LS.set(SRS, state);
        if (g === 0) queue.push(c);            // see it again this session
        pos++;
        show();
      }
      document.addEventListener('keydown', function (e) {
        if (/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) return;
        var ans = document.getElementById('rv-ans');
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          if (ans && ans.hidden) reveal();
          return;
        }
        if (ans && !ans.hidden && /^[123]$/.test(e.key)) { e.preventDefault(); grade(+e.key - 1); }
      });
      show();
    });

    // Answers in cards.json are stored as raw markdown-ish text.
    function mdish(s) {
      return '<p>' + escapeHtml(s)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n{2,}/g, '</p><p>')
        .replace(/\n/g, '<br/>') + '</p>';
    }
  }
})();

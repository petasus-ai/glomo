(function () {
  'use strict';

  /* ---------- map: keep the site list and the markers in step ---------- */
  var mapScope = document.querySelector('.console');
  var siteEls = [].slice.call(mapScope.querySelectorAll('[data-site]'));
  var TOKYO = { akihabara: 1, mitaka: 1, yokohama: 1, kawasaki: 1 };
  var grp = mapScope.querySelector('.mk.grp');
  var grpLabel = mapScope.querySelector('.lb.g');
  function mark(cls, id) {
    siteEls.forEach(function (el) { el.classList.toggle(cls, !!id && el.getAttribute('data-site') === id); });
    var inTokyo = !!id && TOKYO[id] === 1;
    grp.classList.toggle(cls, inTokyo);
    if (cls === 'hot') grpLabel.classList.toggle(cls, inTokyo);
  }
  siteEls.forEach(function (el) {
    if (el.tagName !== 'BUTTON') return;
    var id = el.getAttribute('data-site');
    el.addEventListener('mouseenter', function () { mark('hot', id); });
    el.addEventListener('focus', function () { mark('hot', id); });
    el.addEventListener('mouseleave', function () { mark('hot', null); });
    el.addEventListener('blur', function () { mark('hot', null); });
    el.addEventListener('click', function () { mark('sel', id); });
  });
  grp.addEventListener('mouseenter', function () { mark('hot', 'akihabara'); });
  grp.addEventListener('mouseleave', function () { mark('hot', null); });
  grp.addEventListener('click', function () { mark('sel', 'akihabara'); });
  mark('sel', 'akihabara');

  /* ---------- architecture walk-through ---------- */
  var arch = document.getElementById('arch');
  var wrap = document.getElementById('archwrap');
  var steps = [].slice.call(document.querySelectorAll('#steps .step'));
  var cap = document.getElementById('stepcap');
  var playBtn = document.getElementById('archPlay');
  var N = steps.length, cur = 0, timer = null;
  var DUR = 5200;
  var reduce = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var playing = !reduce, inView = false;

  function running() { return playing && inView; }
  function schedule() {
    clearTimeout(timer);
    wrap.classList.remove('run');
    if (!running()) return;
    void wrap.offsetWidth; // restart the progress bar
    wrap.classList.add('run');
    timer = setTimeout(function () { show(cur + 1); }, DUR);
  }
  function show(i) {
    cur = (i + N) % N;
    var cls = 'arch';
    for (var k = 1; k <= cur + 1; k++) cls += ' s' + k;
    arch.className = cls;
    arch.setAttribute('data-step', String(cur + 1));
    steps.forEach(function (b, k) {
      var on = k === cur;
      b.classList.toggle('on', on);
      if (on) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
    cap.textContent = steps[cur].querySelector('.sd').textContent;
    schedule();
  }
  function setPlaying(p) {
    playing = p;
    playBtn.classList.toggle('paused', !p);
    playBtn.querySelector('span').textContent = p ? 'Pause' : 'Play';
    schedule();
  }
  steps.forEach(function (b, k) {
    b.addEventListener('click', function () { setPlaying(false); show(k); });
  });
  playBtn.addEventListener('click', function () { setPlaying(!playing); });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      inView = entries[0].isIntersecting;
      schedule();
    }, { threshold: 0.2 }).observe(wrap);
  } else {
    inView = true;
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { clearTimeout(timer); wrap.classList.remove('run'); } else { schedule(); }
  });
  show(0);
  if (reduce) setPlaying(false);
})();

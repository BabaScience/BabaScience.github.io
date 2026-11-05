(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme */
  var themeBtn = document.getElementById('theme');
  function syncLabel() {
    var dark = root.getAttribute('data-theme') === 'dark';
    themeBtn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0f1318' : '#fafaf7');
  }
  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
    syncLabel();
  });
  syncLabel();

  /* mobile menu */
  var menuBtn = document.getElementById('menu');
  var nav = document.getElementById('nav');
  function setMenu(open) {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  menuBtn.addEventListener('click', function () { setMenu(!nav.classList.contains('open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setMenu(false); });

  /* header border + active link */
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('scrolled', window.scrollY > 8); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  var links = [].slice.call(nav.querySelectorAll('a'));
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id); });
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    links.forEach(function (a) {
      var s = document.querySelector(a.getAttribute('href'));
      if (s) spy.observe(s);
    });
  }

  /* reveal on scroll, with a small stagger inside each group */
  var items = [].slice.call(document.querySelectorAll('.reveal'));
  items.forEach(function (el) {
    var sibs = [].slice.call(el.parentNode.children).filter(function (c) { return c.classList.contains('reveal'); });
    el.style.setProperty('--d', (Math.min(sibs.indexOf(el), 4) * 0.08) + 's');
  });
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* typing effect on roles */
  var typed = document.getElementById('typed');
  var roles = ['full-stack developer', 'backend engineer', 'system architect', 'AI engineer', 'mobile developer'];
  if (!reduce) {
    var r = 0, c = roles[0].length, del = true;
    (function tick() {
      var word = roles[r];
      if (del) { c--; } else { c++; }
      typed.textContent = word.slice(0, c);
      var wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1800; }
      else if (del && c === 0) { del = false; r = (r + 1) % roles.length; wait = 350; }
      setTimeout(tick, wait);
    })();
  }
})();

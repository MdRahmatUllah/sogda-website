// The page's only script (#22): the page is static HTML and CSS that reads,
// looks and moves without it; this adds the few things that need JS. It
// replaced React's hydration (~108 KB gzip, and a 180 KB RSC payload in every
// page), which blocked the main thread on a phone for no visible gain.
// Each part is keyed on data attributes the server-rendered markup carries.
(function () {
  var root = document.documentElement;
  var $$ = function (sel, el) {
    return Array.prototype.slice.call((el || document).querySelectorAll(sel));
  };
  var reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Calls f once per frame at most, for scroll and resize.
  var perFrame = function (f) {
    var frame = 0;
    return function () {
      if (!frame)
        frame = requestAnimationFrame(function () {
          frame = 0;
          f();
        });
    };
  };
  var swapIcons = function (button, on) {
    $$('[data-icon]', button).forEach(function (i) {
      i.classList.toggle('hidden', (i.getAttribute('data-icon') === 'on') !== on);
    });
  };

  // The header's outline once the page scrolls (HeaderShell).
  var header = document.querySelector('[data-header]');
  if (header) {
    var scrolled = function () {
      header.toggleAttribute('data-scrolled', scrollY > 8);
    };
    scrolled();
    addEventListener('scroll', scrolled, { passive: true });
  }

  // Light or dark, remembered (ThemeToggle; the layout's inline script applies
  // the pick before first paint).
  $$('[data-theme-toggle]').forEach(function (button) {
    var isDark = function () {
      var set = root.dataset.theme;
      return set ? set === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    };
    var show = function () {
      button.setAttribute('aria-pressed', String(isDark()));
      swapIcons(button, isDark());
    };
    show();
    button.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.dataset.theme = next;
      try {
        localStorage.setItem('theme', next);
      } catch {
        // Storage blocked: the pick lasts for this page only.
      }
      show();
    });
  });

  // Choosing a link closes the phone menu (MobileMenu).
  var menu = document.getElementById('menu');
  if (menu)
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) menu.hidePopover();
    });

  // The language links keep the visitor on the same page, and `/` remembers
  // the pick (LanguageSwitch).
  $$('[data-locale-links]').forEach(function (list) {
    list.addEventListener('click', function (e) {
      var link = e.target.closest('a[hreflang]');
      if (!link) return;
      e.preventDefault();
      try {
        localStorage.setItem('locale', link.hreflang);
      } catch {
        // Storage blocked: the link still goes there.
      }
      location.assign(
        location.pathname.replace(/^\/[a-z]{2}(?=\/|$)/, '/' + link.hreflang) + location.hash,
      );
    });
  });

  // The hero loop's pause (HeroPause, WCAG 2.2.2).
  $$('[data-hero-pause]').forEach(function (button) {
    button.addEventListener('click', function () {
      var hero = document.getElementById('hero');
      var paused = !hero.hasAttribute('data-paused');
      hero.toggleAttribute('data-paused', paused);
      button.setAttribute('aria-label', button.dataset[paused ? 'play' : 'pause']);
      swapIcons(button, paused);
    });
  });

  // Each box starts its CSS entrance the first time it scrolls into view
  // (Reveal).
  $$('[data-reveal]').forEach(function (el) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (entries[0].isIntersecting) {
          el.dataset.inview = '';
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
  });

  // The day story: the beat in the middle of the screen picks the phone's
  // screen and how far the ring has filled (DayStoryStage).
  $$('[data-stage]').forEach(function (stage) {
    var beats = $$('[data-beat]', stage);
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var active = Number(e.target.dataset.beat);
          stage.dataset.active = active;
          stage.style.setProperty('--progress', active / (beats.length - 1));
        });
      },
      // A band across the middle of the viewport.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    beats.forEach(function (b) {
      observer.observe(b);
    });
  });

  // The journey follows the scroll: the traveller moves along the road, the
  // stations it has reached light up, and the counter ticks the words met so
  // far. Reduced motion keeps the finished road the markup draws.
  var road = document.getElementById('journey-road');
  var traveller = document.getElementById('journey-traveller');
  var count = document.getElementById('journey-count');
  if (road && traveller && count && !reduced) {
    var svg = road.ownerSVGElement;
    var stations = $$('[data-station]');
    var length = road.getTotalLength();
    var total = Number(count.dataset.total);
    var format = new Intl.NumberFormat(root.lang);
    var journey = function () {
      var box = svg.getBoundingClientRect();
      // Where the road crosses 70 % of the way down the view, so the road's
      // end is reached before the page runs out.
      var p = Math.min(1, Math.max(0, (innerHeight * 0.7 - box.top) / box.height));
      var point = road.getPointAtLength(p * length);
      traveller.setAttribute('transform', 'translate(' + point.x + ' ' + point.y + ')');
      stations.forEach(function (s) {
        s.toggleAttribute('data-lit', p >= Number(s.dataset.at) - 0.005);
      });
      count.textContent = format.format(Math.round(p * total));
    };
    journey();
    addEventListener('scroll', perFrame(journey), { passive: true });
    addEventListener('resize', perFrame(journey));
  }

  // Snap carousels: the dots follow the item nearest the track's middle;
  // dots, prev/next and the arrow keys go to an item (SnapCarousel).
  $$('[data-carousel]').forEach(function (carousel) {
    var track = carousel.querySelector('[data-track]');
    var items = $$('[data-index]', track);
    var dots = $$('[data-dot]', carousel);
    var active = 0;
    var update = function () {
      var middle = track.getBoundingClientRect().left + track.clientWidth / 2;
      var distance = Infinity;
      items.forEach(function (item, i) {
        var box = item.getBoundingClientRect();
        var d = Math.abs(box.left + box.width / 2 - middle);
        if (d < distance) {
          active = i;
          distance = d;
        }
      });
      dots.forEach(function (dot, i) {
        if (i === active) dot.setAttribute('aria-current', 'true');
        else dot.removeAttribute('aria-current');
        dot.firstElementChild.classList.toggle('bg-fg', i === active);
      });
    };
    var go = function (i) {
      var item = items[Math.max(0, Math.min(items.length - 1, i))];
      track.scrollTo({
        left: item.offsetLeft - track.offsetLeft - (track.clientWidth - item.clientWidth) / 2,
        behavior: 'smooth',
      });
    };
    update();
    track.addEventListener('scroll', perFrame(update), { passive: true });
    addEventListener('resize', perFrame(update));
    track.addEventListener('keydown', function (e) {
      var step = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      go(active + step);
    });
    carousel.addEventListener('click', function (e) {
      var button = e.target.closest('[data-dot], [data-go]');
      if (!button) return;
      go(
        button.hasAttribute('data-dot')
          ? Number(button.dataset.dot)
          : active + Number(button.dataset.go),
      );
    });
  });

  // For the e2e tests that click what this drives (and the reveal CSS).
  root.dataset.hydrated = '';
})();

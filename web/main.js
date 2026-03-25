/* ==========================================================================
   Grupo Azul — Portfolio JS v2
   Theme (fixed sync), accessible expand/collapse, scroll reveal, nav shadow
   ========================================================================== */

(function () {
  'use strict';

  var root = document.documentElement;

  // --- Theme ---
  var themeBtn = document.querySelector('.nav__theme');
  var THEME_KEY = 'ga-theme';
  var MANUAL_KEY = 'ga-theme-manual';

  function systemTheme() {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function getTheme() {
    if (localStorage.getItem(MANUAL_KEY)) {
      return localStorage.getItem(THEME_KEY) || systemTheme();
    }
    return systemTheme();
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
  }

  applyTheme(getTheme());

  themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, next);
    localStorage.setItem(MANUAL_KEY, '1');
    applyTheme(next);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () {
    if (!localStorage.getItem(MANUAL_KEY)) {
      applyTheme(systemTheme());
    }
  });

  // --- Nav scroll shadow ---
  var nav = document.querySelector('.nav');
  var scrolled = false;

  function checkScroll() {
    var shouldBeScrolled = window.scrollY > 10;
    if (shouldBeScrolled !== scrolled) {
      scrolled = shouldBeScrolled;
      nav.classList.toggle('is-scrolled', scrolled);
    }
  }

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();

  // --- Expand/Collapse Projects (accessible) ---
  document.querySelectorAll('.project').forEach(function (project) {
    var toggle = project.querySelector('.project__toggle');
    var panelId = toggle.getAttribute('aria-controls');
    var panel = document.getElementById(panelId);
    var toggleText = toggle.querySelector('.project__toggle-text');

    toggleText.textContent = toggleText.dataset.show;

    toggle.addEventListener('click', function () {
      var isOpen = project.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      panel.setAttribute('aria-hidden', String(!isOpen));
      toggleText.textContent = isOpen ? toggleText.dataset.hide : toggleText.dataset.show;
    });
  });

  // --- Scroll Reveal ---
  var reveals = document.querySelectorAll('.project, .method-item, .team__content');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.06,
      rootMargin: '0px 0px -30px 0px'
    });

    reveals.forEach(function (el) { observer.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // --- Smooth scroll for anchor links (skip href="#") ---
  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

})();

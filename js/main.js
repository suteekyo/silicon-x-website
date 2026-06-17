/* ============================================================
   Silicon X — site JavaScript (vanilla, no dependencies)
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile menu toggle ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobileMenu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    // close menu when a link is tapped
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll reveal (with stagger) ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  // stagger siblings inside the same container for a cascading effect
  revealEls.forEach(function (el) {
    var sibs = Array.prototype.filter.call(el.parentNode.children, function (c) {
      return c.classList && c.classList.contains('reveal');
    });
    var idx = sibs.indexOf(el);
    if (idx > 0) { el.style.transitionDelay = Math.min(idx, 6) * 70 + 'ms'; }
  });
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Sticky header shadow on scroll ---------- */
  var header = document.querySelector('.site-header');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 10);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Current year in footer ---------- */
  var yr = document.getElementById('year');
  if (yr) { yr.textContent = new Date().getFullYear(); }

  /* ---------- Contact form validation + submit ---------- */
  var form = document.getElementById('contactForm');
  if (!form) return;

  var status = document.getElementById('formStatus');

  function showError(field, on) {
    var err = form.querySelector('[data-error-for="' + field.name + '"]');
    if (err) { err.classList.toggle('show', on); }
  }

  function validEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var ok = true;
    var name = form.elements['name'];
    var email = form.elements['email'];
    var message = form.elements['message'];

    [name, email, message].forEach(function (f) {
      var bad = !f.value.trim();
      if (f === email && f.value.trim() && !validEmail(f.value)) bad = true;
      showError(f, bad);
      if (bad) ok = false;
    });

    if (!ok) { return; }

    // -------------------------------------------------------
    // TODO: connect to a no-backend form service.
    // 1) Create a free endpoint at https://formspree.io or https://web3forms.com
    // 2) Put the endpoint URL in form action="" (Formspree) OR
    //    paste your Web3Forms access key into the hidden input below.
    // Until configured, we just show a success message locally.
    // -------------------------------------------------------
    var action = form.getAttribute('action');
    if (action && action.indexOf('http') === 0) {
      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (r) {
        if (r.ok) { done(true); form.reset(); }
        else { done(false); }
      }).catch(function () { done(false); });
    } else {
      done(true);
      form.reset();
    }
  });

  function done(success) {
    if (!status) return;
    status.className = 'form-status show ' + (success ? 'ok' : 'err');
    status.textContent = success
      ? 'Thank you! Your message has been sent. We will get back to you shortly.'
      : 'Sorry, something went wrong. Please email us directly at jedsada@siliconx.co.th.';
  }
})();

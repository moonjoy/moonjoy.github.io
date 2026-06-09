(function() {
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';

  // Tag case-study pages (any page that loads the header with a non-empty
  // base path, e.g. data-base="../../"). Used by CSS to switch the
  // wrapper background to white on inner pages.
  if (base) {
    document.documentElement.classList.add('is-case-study');
  }

  var fallback = '<nav class="nav-home"><div class="nav-inner"><span id="brand"><a href="/" data-page="home"><img src="/projects/selfportrait.png" class="about-image" alt="Barsha"></a></span>' +
    '<ul id="menu" class="main-menu">' +
    '<li class="main-menu-item nav-dropdown"><button type="button" class="nav-dropdown-trigger" aria-expanded="false" aria-haspopup="true">Projects<svg class="nav-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<ul class="nav-submenu" role="menu">' +
    '<li role="none"><a role="menuitem" href="/pages/web/candidpdp.html" data-page="projects">Candid PDP: Seals of Transparency</a></li>' +
    '<li role="none"><a role="menuitem" href="/pages/web/mybrainandme.html" data-page="projects">My Brain and Me</a></li>' +
    '<li role="none"><a role="menuitem" href="/pages/web/coreweave.html" data-page="projects">Concierge Render</a></li>' +
    '<li role="none"><a role="menuitem" href="/pages/web/philanthropynewsdigest.html" data-page="projects">Philanthropy News Digest</a></li>' +
    '<li role="none" class="nav-submenu-all"><a role="menuitem" href="/#projects" data-page="projects">All projects</a></li>' +
    '</ul></li>' +
    '<li class="main-menu-item"><a href="/#about" data-page="about">About me</a></li></ul>' +
    '<button type="button" id="toggle" class="nav-toggle" aria-label="Open menu" aria-expanded="false" aria-controls="resize"><span class="span">Menu</span></button></div></nav>' +
    '<div id="resize" aria-hidden="true"><div class="resize-inner"><button type="button" class="close-btn" aria-label="Close menu">Close</button>' +
    '<ul id="menu" class="resize-menu">' +
    '<li class="resize-dropdown"><button type="button" class="resize-dropdown-trigger" aria-expanded="false">Projects<svg class="nav-chevron resize-chevron" width="10" height="6" viewBox="0 0 10 6" aria-hidden="true"><path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>' +
    '<ul class="resize-submenu">' +
    '<li><a href="/pages/web/candidpdp.html" data-page="projects">Candid PDP: Seals of Transparency</a></li>' +
    '<li><a href="/pages/web/mybrainandme.html" data-page="projects">My Brain and Me</a></li>' +
    '<li><a href="/pages/web/coreweave.html" data-page="projects">Concierge Render</a></li>' +
    '<li><a href="/pages/web/philanthropynewsdigest.html" data-page="projects">Philanthropy News Digest</a></li>' +
    '<li><a href="/#projects" data-page="projects">All projects</a></li>' +
    '</ul></li>' +
    '<li><a href="/#about" data-page="about">About me</a></li></ul></div></div>';

  function setActiveState(container) {
    var current = (container.getAttribute('data-current') || '').toLowerCase();
    if (current === 'home' || !current) return;
    if (current === 'projects') {
      var trigger = container.querySelector('.nav-dropdown-trigger');
      if (trigger) trigger.classList.add('active-link');
      return;
    }
    var links = container.querySelectorAll('a[data-page="' + current + '"]');
    for (var i = 0; i < links.length; i++) links[i].classList.add('active-link');
  }

  function bindActiveOnClick(container) {
    container.addEventListener('click', function(e) {
      var link = e.target.closest && e.target.closest('a[data-page]');
      if (!link) return;
      if (link.closest('#brand')) {
        link.classList.remove('active-link');
        return;
      }
      var all = container.querySelectorAll('a[data-page]');
      for (var i = 0; i < all.length; i++) all[i].classList.remove('active-link');
      link.classList.add('active-link');
    });
  }

  function normalizePath(pathname) {
    return pathname.replace(/\/index\.html$/i, '/');
  }

  function bindSmoothSectionScroll(container) {
    container.addEventListener('click', function(e) {
      var link = e.target.closest && e.target.closest('a[href*="#"]');
      if (!link) return;

      var url;
      try {
        url = new URL(link.getAttribute('href'), window.location.href);
      } catch (_) {
        return;
      }

      if (!url.hash) return;

      var samePage = normalizePath(url.pathname) === normalizePath(window.location.pathname);
      if (!samePage) return;

      var target = document.getElementById(url.hash.slice(1));
      if (!target) return;

      e.preventDefault();
      var nav = document.querySelector('nav');
      var offset = nav ? nav.offsetHeight + 12 : 72;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
      history.replaceState(null, '', url.hash);
    });
  }

  function rewriteLinks(container, base) {
    base = base || '';
    var links = container.querySelectorAll('a[href^="/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var path = a.getAttribute('href').slice(1);
      if (!path || path.indexOf('#') === 0) path = 'index.html' + (path || '');
      a.setAttribute('href', base + path);
    }
    var imgs = container.querySelectorAll('img[src^="/"]');
    for (var j = 0; j < imgs.length; j++) {
      var img = imgs[j];
      img.setAttribute('src', base + img.getAttribute('src').slice(1));
    }
  }

  function runNavAnimation(container) {
    if (typeof TweenMax === 'undefined') return;
    var brand = container.querySelector('#brand');
    if (!brand) return;
    var current = (container.getAttribute('data-current') || '').toLowerCase();
    var delay = (current === 'home' || !current) ? 1 : 0.4;
    TweenMax.from(brand, 1, { delay: delay, y: 10, opacity: 0, ease: Expo.easeInOut });
    var items = container.querySelectorAll('.main-menu > li > a, .main-menu > li > .nav-dropdown-trigger');
    if (!items.length) return;
    TweenMax.staggerFrom(items, 1, { delay: delay, opacity: 0, ease: Expo.easeInOut }, 0.1);
  }

  function run() {
    var container = document.getElementById('header-container');
    if (!container) return;

    function showHeader(html) {
      container.innerHTML = html;
      rewriteLinks(container, base);
      setActiveState(container);
      bindActiveOnClick(container);
      bindSmoothSectionScroll(container);
      runNavAnimation(container);
      document.dispatchEvent(new CustomEvent('headerLoaded'));
    }

    fetch(base + 'partials/header.html')
      .then(function(r) { if (r.ok) return r.text(); throw new Error('Not ok'); })
      .then(showHeader)
      .catch(function() { showHeader(fallback); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();

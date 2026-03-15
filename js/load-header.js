(function() {
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';

  var fallback = '<nav class="nav-home"><span id="brand"><a href="/" data-page="home"><img src="/projects/selfportrait.png" class="about-image" alt="Barsha"></a></span>' +
    '<ul id="menu" class="main-menu"><li class="hide-section"><a href="/#projects" data-page="product-thinking">Product thinking</a></li><li><a href="/#projects" data-page="projects">Projects</a></li><li class="hide-section"><a href="/#projects" data-page="articles">Articles</a></li><li class="hide-section"><a href="/#projects" data-page="figma-plugins">Figma plugins</a></li><li class="main-menu-item"><a href="/pages/about/about.html" data-page="about">About me</a></li></ul>' +
    '<div id="toggle"><div class="span">Menu</div></div></nav>' +
    '<div id="resize"><div class="close-btn">Close</div><ul id="menu"><li><a href="/#projects" data-page="projects">Projects</a></li><li><a href="/pages/about/about.html" data-page="about">About me</a></li></ul></div>';

  function setActiveState(container) {
    var current = (container.getAttribute('data-current') || '').toLowerCase();
    if (current === 'home' || !current) return;
    var links = container.querySelectorAll('a[data-page="' + current + '"]');
    for (var i = 0; i < links.length; i++) links[i].classList.add('active-link');
  }

  function bindActiveOnClick(container) {
    container.addEventListener('click', function(e) {
      var link = e.target.closest && e.target.closest('a[data-page]');
      if (!link) return;
      var all = container.querySelectorAll('a[data-page]');
      for (var i = 0; i < all.length; i++) all[i].classList.remove('active-link');
      link.classList.add('active-link');
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

  function run() {
    var container = document.getElementById('header-container');
    if (!container) return;

    function showHeader(html) {
      container.innerHTML = html;
      rewriteLinks(container, base);
      setActiveState(container);
      bindActiveOnClick(container);
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

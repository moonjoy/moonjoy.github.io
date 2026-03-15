(function() {
  var script = document.currentScript;
  var base = (script && script.getAttribute('data-base')) || '';

  function rewriteLinks(container, base) {
    base = base || '';
    var links = container.querySelectorAll('a[href^="/"]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var path = a.getAttribute('href').slice(1);
      if (!path || path.indexOf('#') === 0) path = 'index.html' + (path || '');
      a.setAttribute('href', base + path);
    }
  }

  function run() {
    var container = document.getElementById('footer-container');
    if (!container) return;

  var fallback = '<div class="footer m-top-10"><div class="container"><div class="info"><div class="row">' +
    '<div class="col-lg-4" id="personal"><h4 class="wow fadeInUp" data-wow-delay="0.2s"><a href="/pages/about/about.html">about me</a></h4></div>' +
    '<div class="col-lg-4" id="media"><ul>' +
    '<li id="em" class="wow fadeInUp" data-wow-delay="0.4s"><a href="mailto:barsha.mhr@gmail.com" target="_blank"><ion-icon name="mail"></ion-icon></a></li>' +
    '<li id="lin" class="wow fadeInUp" data-wow-delay="0.6s"><a href="https://www.linkedin.com/in/maharjanbarsha/" target="_blank"><ion-icon name="logo-linkedin"></ion-icon></a></li>' +
    '</ul></div>' +
    '<div class="col-lg-4" id="address"><h4 class="wow fadeInUp" data-wow-delay="0.2s"><a href="mailto:barsha.mhr@gmail.com" target="_blank">barsha.mhr@gmail.com</a></h4></div>' +
    '</div></div></div></div>';

  function showFooter(html) {
    container.innerHTML = html;
    rewriteLinks(container, base);
  }

  fetch(base + 'partials/footer.html')
    .then(function(r) { if (r.ok) return r.text(); throw new Error('Not ok'); })
    .then(showFooter)
    .catch(function() { showFooter(fallback); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();

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

  function run() {
    var container = document.getElementById('footer-container');
    if (!container) return;

  var fallback = `
<div class="footer footer-v2 m-top-10">
  <div class="container">
    <div class="footer-v2-rule"></div>
    <div class="footer-v2-card">
      <div class="footer-v2-grid">
        <div class="footer-v2-col footer-v2-intro">
          <h4>Let's connect</h4>
          <p>Open to new projects, collaborations, and conversations.</p>
          <a href="mailto:barsha.mhr@gmail.com" class="button-light-outline button-small" role="button">Contact me</a>
        </div>
        <div class="footer-v2-col">
          <h4>Navigation</h4>
          <a href="/index.html">Home</a>
          <a href="/#about">About</a>
          <a href="/#projects">Projects</a>
          <a href="/projects/resume/BarshaMaharjan-Resume.pdf" target="_blank" rel="noopener noreferrer">Resume</a>
        </div>
        <div class="footer-v2-col">
          <h4>Socials</h4>
          <div class="footer-v2-icons">
            <a href="https://www.linkedin.com/in/maharjanbarsha/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><ion-icon name="logo-linkedin"></ion-icon></a>
            <a href="mailto:barsha.mhr@gmail.com" aria-label="Email"><ion-icon name="mail"></ion-icon></a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-v2-meta">
      <span>Copyright © Barsha Maharjan 2026</span>
      <a href="mailto:barsha.mhr@gmail.com">barsha.mhr@gmail.com</a>
    </div>
  </div>
</div>`;

  function showFooter(html) {
    container.innerHTML = html;
    rewriteLinks(container, base);
    bindSmoothSectionScroll(container);
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

(function () {
  if (window.self === window.top) return;

  document.documentElement.classList.add("page-embed");

  function hideChromeInEmbed() {
    var byId = ["header-container", "footer-container"];
    for (var i = 0; i < byId.length; i++) {
      var el = document.getElementById(byId[i]);
      if (el) el.style.setProperty("display", "none", "important");
    }
    var selectors = [".wrapper .footer", ".project-nav", ".kw-keep-reading", "#keep-reading-container"];
    for (var j = 0; j < selectors.length; j++) {
      var nodes = document.querySelectorAll(selectors[j]);
      for (var k = 0; k < nodes.length; k++) {
        nodes[k].style.setProperty("display", "none", "important");
      }
    }
    var hc = document.getElementById("header-container");
    if (hc && hc.nextElementSibling && hc.nextElementSibling.tagName === "SCRIPT") {
      var sp = hc.nextElementSibling.nextElementSibling;
      if (
        sp &&
        sp.classList &&
        (sp.classList.contains("whitespace-sub") || sp.classList.contains("whitespace"))
      ) {
        sp.style.setProperty("display", "none", "important");
      }
    }
  }

  function ensureYouTubeEmbedUrls() {
    var origin;
    try {
      origin = window.location.origin;
    } catch (e) {
      origin = "";
    }
    var nodes = document.querySelectorAll(
      'iframe[src*="youtube.com/embed"], iframe[src*="youtube-nocookie.com/embed"]'
    );
    for (var j = 0; j < nodes.length; j++) {
      var el = nodes[j];
      var original = el.getAttribute("src") || "";
      if (!original) continue;
      var s = original;
      if (s.indexOf("youtube.com/embed") !== -1 && s.indexOf("youtube-nocookie.com") === -1) {
        s = s.replace("www.youtube.com/embed", "www.youtube-nocookie.com/embed");
      }
      if (origin && origin !== "null" && s.indexOf("origin=") === -1) {
        s += (s.indexOf("?") !== -1 ? "&" : "?") + "origin=" + encodeURIComponent(origin);
      }
      if (!el.hasAttribute("referrerpolicy")) {
        el.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      }
      if (!el.hasAttribute("allow")) {
        el.setAttribute(
          "allow",
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        );
      }
      if (!el.hasAttribute("allowfullscreen")) {
        el.setAttribute("allowfullscreen", "");
      }
      if (s !== original) {
        el.setAttribute("src", s);
      }
    }
  }

  function run() {
    hideChromeInEmbed();
    ensureYouTubeEmbedUrls();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
  document.addEventListener("headerLoaded", run);
  [0, 100, 400, 1200, 2500].forEach(function (ms) {
    setTimeout(run, ms);
  });
})();

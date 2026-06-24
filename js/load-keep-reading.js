/*
 * "Keep reading" loader — injects a 2-card "More projects" section at
 * the bottom of every case-study page.
 *
 * USAGE on a case-study page (replaces the old text-only `.project-nav`):
 *
 *   <div id="keep-reading-container"></div>
 *   <script src="../../js/load-keep-reading.js" data-base="../../"></script>
 *
 * Suggestions follow the homepage featured-project order (see
 * FEATURED_ORDER). The current page is skipped; the next two entries
 * are shown (wrapping at the end). Pages outside that list get the first
 * two homepage picks.
 *
 * Optional `data-suggest="key1,key2"` overrides the automatic picks.
 * `data-base` is the prefix to reach the site root from the current page.
 */
(function () {
  var script = document.currentScript;
  var base = (script && script.getAttribute("data-base")) || "";

  // Matches index.html featured projects order.
  var FEATURED_ORDER = [
    "candidpdp",
    "mybrainandme",
    "coreweave",
    "philanthropynewsdigest",
  ];

  // Central registry of every case study / project that can appear as
  // a "Keep reading" suggestion. Hrefs are stored relative to the
  // site root; the loader prefixes `base` at injection time.
  var REGISTRY = {
    candidpdp: {
      href: "pages/web/candidpdp.html",
      eyebrow: "Candid",
      title: "Candid PDP — Seals of Transparency",
      lede: "Redesigning a multi-step compliance form into a motivating, seal-driven surface nonprofits return to year after year.",
      tint: "sky",
    },
    genaicopywriter: {
      href: "pages/web/genaicopywriter.html",
      eyebrow: "Candid · Innovation Fund",
      title: "Generative Copywriter",
      lede: "Validated generative AI for turning IRS-scraped ALL CAPS mission text into readable copy nonprofits would approve — successful pilot, never shipped due to resourcing.",
      tint: "butter",
    },
    philanthropynewsdigest: {
      href: "pages/web/philanthropynewsdigest.html",
      eyebrow: "Candid",
      title: "Philanthropy News Digest",
      lede: "Lead UX/UI and front-end work on the sector news hub — jobs, resources, newsletters, and philanthropy coverage.",
      tint: "mint",
    },
    mybrainandme: {
      href: "pages/web/mybrainandme.html",
      eyebrow: "My Brain and Me",
      title: "My Brain and Me",
      lede: "UX/UI design and build for a neuroscience research platform connecting participants with brain-health studies.",
      tint: "blush",
    },
    himalayanwildfibers: {
      href: "pages/web/himalayanwildfibers.html",
      eyebrow: "Himalayan Wild Fibers",
      title: "Himalayan Wild Fibers",
      lede: "Website redesign for a natural fiber company with fair sourcing that supports Himalayan communities.",
      tint: "sand",
    },
    coreweave: {
      href: "pages/web/coreweave.html",
      eyebrow: "CoreWeave",
      title: "Concierge Render",
      lede: "Site rebrand and UI development for CoreWeave's cloud GPU rendering platform and marketing surfaces.",
      tint: "lavender",
    },
    foundationdirectory: {
      href: "pages/web/foundationdirectory.html",
      eyebrow: "Candid",
      title: "Foundation Directory",
      lede: "Research tool used by nonprofits and grantmakers to find funders, grants, and the people behind the philanthropy ecosystem.",
      tint: "butter",
    },
    eattendance: {
      href: "pages/web/eattendance.html",
      eyebrow: "eAttendance",
      title: "eAttendance",
      lede: "Attendance management system designed to simplify how schools track and report student attendance.",
      tint: "peach",
    },
    prism: {
      href: "pages/web/prism.html",
      eyebrow: "Parsons MFADT",
      title: "Prism",
      lede: "MFA Design & Technology website at Parsons — an animated showcase for student work, faculty, and program details.",
      tint: "stone",
    },
    cardin: {
      href: "pages/web/cardin.html",
      eyebrow: "Charlotte Cardin",
      title: "Charlotte Cardin — Album Concept",
      lede: "Concept website pairing motion and typography with Charlotte Cardin's album to extend the record's mood online.",
      tint: "blush",
    },
    rapiddetectionsystems: {
      href: "pages/web/rapiddetectionsystems.html",
      eyebrow: "Rapid Detection Systems",
      title: "Rapid Detection Systems",
      lede: "Marketing site refresh for an industrial detection company — clearer hierarchy, modern visuals, faster routes to inquiry.",
      tint: "sky",
    },
    rapidmotionservices: {
      href: "pages/web/rapidmotionservices.html",
      eyebrow: "Rapid Motion Services",
      title: "Rapid Motion Services",
      lede: "Site redesign for a logistics services company centered on clarity, trust, and operator-friendly information density.",
      tint: "stone",
    },
    fi2w: {
      href: "pages/web/fi2w.html",
      eyebrow: "Feet in 2 Worlds",
      title: "Feet in 2 Worlds",
      lede: "Editorial-style redesign for an immigrant journalism project — readable archives, clean storytelling, accessible navigation.",
      tint: "mint",
    },
    micdrop: {
      href: "pages/projects/micdrop.html",
      eyebrow: "Animation",
      title: "Micdrop",
      lede: "Motion capture short — performance-driven animation experiment built end-to-end with a small team.",
      tint: "lavender",
    },
    magikku: {
      href: "pages/projects/magikku.html",
      eyebrow: "VR Game",
      title: "Magikku",
      lede: "VR game prototype exploring spell-casting interactions and embodied play in room-scale environments.",
      tint: "peach",
    },
    chagubakha: {
      href: "pages/projects/chagubakha.html",
      eyebrow: "Animation",
      title: "Chagu Bakha",
      lede: "Stylized animation rooted in folklore — character design, rigging, and storytelling explored as a personal project.",
      tint: "sand",
    },
  };

  function currentSlug() {
    var parts = window.location.pathname.split("/");
    var file = parts[parts.length - 1] || "";
    return file.replace(/\.html$/i, "").toLowerCase();
  }

  function pickFeaturedSuggestions(excludeKey, count) {
    count = count || 2;
    var idx = FEATURED_ORDER.indexOf(excludeKey);
    if (idx === -1) {
      return FEATURED_ORDER.slice(0, count);
    }
    var picks = [];
    for (var i = 1; i <= FEATURED_ORDER.length && picks.length < count; i++) {
      picks.push(FEATURED_ORDER[(idx + i) % FEATURED_ORDER.length]);
    }
    return picks;
  }

  function buildCard(key) {
    var item = REGISTRY[key];
    if (!item) return "";
    var tint = item.tint || "stone";
    return (
      '<a class="kw-card kw-card--' + tint + '" href="' + base + item.href + '">' +
      '<p class="kw-card__eyebrow">' + item.eyebrow + "</p>" +
      '<h3 class="kw-card__title">' + item.title + "</h3>" +
      '<p class="kw-card__lede">' + item.lede + "</p>" +
      '<span class="kw-card__cta">Read case study</span>' +
      "</a>"
    );
  }

  function run() {
    var container = document.getElementById("keep-reading-container");
    if (!container) return;

    var raw = container.getAttribute("data-suggest") || "";
    var keys = raw
      .split(",")
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s && REGISTRY[s]; });

    if (!keys.length) {
      keys = pickFeaturedSuggestions(currentSlug(), 2);
    }

    if (!keys.length) return;

    var cards = keys.map(buildCard).join("");
    container.innerHTML =
      '<section class="kw-keep-reading" aria-labelledby="keep-reading-title">' +
      '<div class="kw-keep-reading__head">' +
      '<h2 id="keep-reading-title" class="kw-keep-reading__title">Keep reading</h2>' +
      '<p class="kw-keep-reading__lede">More examples of design that drives results.</p>' +
      "</div>" +
      '<div class="kw-keep-reading__grid">' + cards + "</div>" +
      "</section>";
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();

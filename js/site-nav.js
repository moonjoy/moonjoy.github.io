/**
 * Shared nav: mobile overlay toggle + Projects dropdown.
 */
(function ($) {
  $(function () {
    $(document).on("click", "#toggle", function () {
      var open = !$(this).hasClass("on");
      $(this).toggleClass("on").attr("aria-expanded", open);
      $("#resize").toggleClass("active").attr("aria-hidden", !open);
    });

    $(document).on("click", "#resize ul li a", function () {
      $("#toggle").removeClass("on").attr("aria-expanded", "false");
      $("#resize").removeClass("active").attr("aria-hidden", "true");
    });

    $(document).on("click", ".close-btn", function () {
      $("#toggle").removeClass("on").attr("aria-expanded", "false");
      $("#resize").removeClass("active").attr("aria-hidden", "true");
    });

    /* Mobile: expand / collapse Projects list */
    $(document).on("click", ".resize-dropdown-trigger", function () {
      var open = !$(this).closest(".resize-dropdown").hasClass("is-open");
      $(this)
        .closest(".resize-dropdown")
        .toggleClass("is-open")
        .find(".resize-dropdown-trigger")
        .attr("aria-expanded", open);
    });

    /* Desktop: click toggle for touch / keyboard */
    $(document).on("click", ".nav-dropdown", function (e) {
      e.stopPropagation();
    });

    $(document).on("click", ".nav-dropdown-trigger", function (e) {
      e.stopPropagation();
      var $dropdown = $(this).closest(".nav-dropdown");
      var open = !$dropdown.hasClass("is-open");
      $(".nav-dropdown.is-open")
        .not($dropdown)
        .removeClass("is-open")
        .find(".nav-dropdown-trigger")
        .attr("aria-expanded", "false");
      $dropdown.toggleClass("is-open", open);
      $(this).attr("aria-expanded", open);
    });

    $(document).on("click", function (e) {
      if ($(e.target).closest(".nav-dropdown").length) return;
      $(".nav-dropdown.is-open")
        .removeClass("is-open")
        .find(".nav-dropdown-trigger")
        .attr("aria-expanded", "false");
    });

    $(document).on("click", ".nav-submenu a", function () {
      $(this).closest(".nav-dropdown").removeClass("is-open");
      $(".nav-dropdown-trigger").attr("aria-expanded", "false");
    });

    /* Desktop: close click-opened dropdown when pointer leaves */
    $(document).on("mouseleave", ".nav-dropdown", function () {
      var $dropdown = $(this);
      if (!$dropdown.hasClass("is-open")) return;
      $dropdown
        .removeClass("is-open")
        .find(".nav-dropdown-trigger")
        .attr("aria-expanded", "false")
        .blur();
    });
  });
})(jQuery);

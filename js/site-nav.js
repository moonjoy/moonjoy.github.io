/**
 * Shared mobile nav toggle (requires jQuery). Loaded after jQuery on all pages with the shared header.
 */
(function ($) {
  $(function () {
    $(document).on("click", "#toggle", function () {
      $(this).toggleClass("on");
      $("#resize").toggleClass("active");
    });

    $(document).on("click", "#resize ul li a", function () {
      $("#toggle").removeClass("on");
      $("#resize").toggleClass("active");
    });

    $(document).on("click", ".close-btn", function () {
      $("#toggle").removeClass("on");
      $("#resize").toggleClass("active");
    });
  });
})(jQuery);

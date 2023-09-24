<script>
    /*
    * Hide header on scroll down; restore on scroll up.
    * Based on https://codepen.io/oscarpas/pen/oNpLNx
    */
    jQuery(document).ready(function( $ ) {
        var lastScrollTop = 0;
        var delta = 5;

        $(window).scroll(function(event) {
            var st = $(this).scrollTop();

            if (Math.abs(lastScrollTop - st) <= delta)
                return;

            if ((st > lastScrollTop) && (lastScrollTop > 0)) {
                // downscroll code
                $(".site-header").css("top", "-80px");

                var toggle = $(".main-header-menu-toggle");
                if (toggle.attr("aria-expanded") == "true") {
                    toggle.click();
                }
            } else {
                // upscroll code
                $(".site-header").css("top", "0px");
            }

            lastScrollTop = st;
        });
    });
</script>
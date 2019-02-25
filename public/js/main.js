$(document).ready(function() {
    "use strict";

    $('#back-top a').on("click", function() {
        $('body,html').animate({
            scrollTop: 0
        }, 1000);
        return false;
    });

    // Header scroll class
    $(window).scroll(function() {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
            $('#back-top').fadeIn(500);
        } else {
            $('#header').removeClass('header-scrolled');
            $('#back-top').fadeOut(500);
        }
    });

    // Rocket Scroll
    $(window).scroll(function() {
        if ($(this).scrollTop() > 10) {
            $('#back-top').fadeIn(500);
        } else {
            $('#back-top').fadeOut(500);
        }
    });
});
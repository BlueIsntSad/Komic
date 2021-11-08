$(document).ready(function(){
    $('.manga_slider').slick({
        dots: true,
        infinite: true,
        speed: 500,
        fade: true,
        cssEase: 'cubic-bezier(.2,.25,.9,.69)',
        autoplay: true,
        autoplaySpeed: 3000,
    });
});
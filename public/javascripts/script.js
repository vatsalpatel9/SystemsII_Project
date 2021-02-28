// Auto hide/show navbar on scroll
console.log("test");
/*
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {
    var currentScrollpos = window.pageYOffset;
    if(prevScrollpos > currentScrollpos){
        document.getElementById("navbar").style.top = "0";
    }else{
        document.getElementById("navbar").style.top = "-70px";
    }
    prevScrollpos = currentScrollpos;
}*/

// Active Menu Idicator
$(document).ready(function(){ 
    $(window).on('scroll', function(){
        var link = $('.navbar a');
        var top = $(window).scrollTop();

        $('.showcase').each(function(){
            var id = $(this).attr('id');
            var height = $(this).height();
            var offset = $(this).offset().top - 150;
            if(top >= offset && top < offset + height){
                link.removeClass('active');
                $('.navbar').find('[data-scroll="' + id + '"]').addClass('active');
            }
        });
    });
});
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
$(document).ready(function () {
    $(window).on("scroll", function () {
        var link = $(".navbar a");
        var top = $(window).scrollTop();

        $(".sectionIndicator").each(function () {
            var id = $(this).attr("id");
            var height = $(this).height();
            var offset = $(this).offset().top - 150;
            if (top >= offset && top < offset + height) {
                link.removeClass("active");
                $(".navbar")
                    .find('[data-scroll="' + id + '"]')
                    .addClass("active");
            }
        });
    });
});

$(function () {
    var path = window.location.pathname;
    console.log(path);
    $(".navbar a[href='" + path + "']").addClass("active");
});

/*
$(function(){
  $('a').each(function() {
    if ($(this).prop('href') == window.location.href) {
      $(this).addClass('active');
    }
  });
});*/

//Mobile navbar toggle
$(document).ready(function () {
    $("#toggleBtn").on("click", function () {
        var mySidebar = document.getElementById("mySidebar");
       // mySidebar.style.display = "block";
          if (mySidebar.style.display === "block") {
            mySidebar.style.display = "none";
          } else {
            mySidebar.style.display = "block";
          }
       // $("#navlist").toggleClass("show");
    });

    $(".menu").on("click", function () {
       var mySidebar = document.getElementById("mySidebar");
       mySidebar.style.display = "none";
    });
});

// Toggle between showing and hiding the sidebar when clicking the menu icon
var mySidebar = document.getElementById("mySidebar");
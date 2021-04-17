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

//Set min and max dates
var today = new Date();
var oneMonth = new Date();
var dd = today.getDate() + 1;
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();
if (dd < 10) {
  dd = "0" + dd;
}
if (mm < 10) {
  mm = "0" + mm;
}
today = yyyy + "-" + mm + "-" + dd;
var newMM = oneMonth.getMonth() + 2;
if (newMM < 10) {
  newMM = "0" + newMM;
}
oneMonth = yyyy + "-" + newMM + "-" + dd;
console.log(oneMonth);
window.onload = function(){
  document.getElementById("days").setAttribute("min", today);
  document.getElementById("days").setAttribute("max", oneMonth);
}


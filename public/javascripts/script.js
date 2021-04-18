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

$(document).ready(function () {
  var defaultselectbox = $("#serviceSelector");
  var numOfOptions = $("#serviceSelector").children("option").length;

  // hide select tag
  defaultselectbox.addClass("s-hidden");

  // wrapping default selectbox into custom select block
  defaultselectbox.wrap('<div class="cusSelBlock"></div>');

  // creating custom select div
  defaultselectbox.after('<div class="selectLabel"></div>');

  // getting default select box selected value
  $(".selectLabel").text(defaultselectbox.children("option").eq(0).text());

  // appending options to custom un-ordered list tag
  var cusList = $("<ul/>", { class: "options" }).insertAfter($(".selectLabel"));

  // generating custom list items
  for (var i = 0; i < numOfOptions; i++) {
    $("<li/>", {
      text: defaultselectbox.children("option").eq(i).text(),
      rel: defaultselectbox.children("option").eq(i).val(),
    }).appendTo(cusList);
  }

  // open-list and close-list items functions
  function openList() {
    for (var i = 0; i < numOfOptions; i++) {
      $(".options")
        .children("li")
        .eq(i)
        .attr("tabindex", i)
        .css("transform", "translateY(" + (i * 100 + 100) + "%)")
        .css("transition-delay", i * 30 + "ms");
    }
  }

  function closeList() {
    for (var i = 0; i < numOfOptions; i++) {
      $(".options")
        .children("li")
        .eq(i)
        .css("transform", "translateY(" + i * 0 + "px)")
        .css("transition-delay", i * 0 + "ms");
    }
    $(".options")
      .children("li")
      .eq(1)
      .css("transform", "translateY(" + 2 + "px)");
    $(".options")
      .children("li")
      .eq(2)
      .css("transform", "translateY(" + 4 + "px)");
  }

  // click event functions
  $(".selectLabel").click(function () {
    $(this).toggleClass("active");
    if ($(this).hasClass("active")) {
      openList();
      focusItems();
    } else {
      closeList();
    }
  });

  $(".options li").on("keypress click", function (e) {
    e.preventDefault();
    $(".options li").siblings().removeClass();
    closeList();
    $(".selectLabel").removeClass("active");
    $(".selectLabel").text($(this).text());
    defaultselectbox.val($(this).text());
	$(".showcase-form").hide();
	switch($(".selectLabel").text()){
		case "Riding Lesson":
			$('#ridingLesson').show();
			break;
		case "Horse Training":
			$("#horseTraining").show();
			break;
		case "Horse Lodging":
			$("#horseLodging").show();
			break;
		default:
			$('#ridingLesson').show();
			break;
	}
  });
});

function focusItems() {

	$('.options').on('focus', 'li', function() {
		$this = $(this);
		$this.addClass('active').siblings().removeClass();
	}).on('keydown', 'li', function(e) {
		$this = $(this);
		if (e.keyCode == 40) {
			$this.next().focus();
			return false;
		} else if (e.keyCode == 38) {
			$this.prev().focus();
			return false;
		}
	}).find('li').first().focus();

}

function getUrlVars() {
  var vars = [],
    hash;
  var hashes = window.location.href
    .slice(window.location.href.indexOf("?") + 1)
    .split("&");
  for (var i = 0; i < hashes.length; i++) {
    hash = hashes[i].split("=");
    vars.push(hash[0]);
    vars[hash[0]] = hash[1];
  }
  return vars;
}
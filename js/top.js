$(function(){
  $(".product-name").css("color", font_color1);
  $(".product-name").css("borderColor", theme_color);
  $(".article-title").css("color", theme_color);
  $(".comment").css("color",font_color1);
  $(".headline-wrap").css("background-color",body_color3);
  $(".product-wrap").css("background-color",body_color4);
  $(".post-wrap").css("background-color",body_color4);
  $(".post").css("background-image",`linear-gradient(135deg, ${body_color2} 25px, transparent 0)`);
  $("#name-en").hide().fadeIn(2000);
  $("#name-jp").hide().fadeIn(2000);
  $('.headline-wrap').hide().fadeIn(500);
  $('.post').hide().fadeIn(500);
  $('.product-wrap').hide().fadeIn(500);
  var bottom_margin = '30px';
  var left_margin = '20px';
  if ($(window).width() < 500) {
    bottom_margin = '10px';
    left_margin = '20px';
  };
  $('.content-ele-title').animate({marginLeft : left_margin} , 1500 , 'swing');
  $('.headline-wrap').animate({marginBottom : bottom_margin} , 1000 , 'swing');
  $('.product-wrap').animate({marginBottom : bottom_margin} , 1000 , 'swing');
  $('.font_color1').css("color",font_color1);
  $('.font_color2').css("color",font_color2);
})

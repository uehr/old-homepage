$(function () {
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
  $('.content-ele-title').animate({ marginLeft: left_margin }, 1500, 'swing');
  $('.headline-wrap').animate({ marginBottom: bottom_margin }, 1000, 'swing');
  $('.product-wrap').animate({ marginBottom: bottom_margin }, 1000, 'swing');
})

$(function () {
  $("#name-en").hide().fadeIn(2000);
  $("#name-jp").hide().fadeIn(2000);
  $('.headline-wrap').hide().fadeIn(500);
  $('.post').hide().fadeIn(500);
  $('.product-wrap').hide().fadeIn(500);

  var bottom_margin = '6vh';

  if ($(window).width() < 500) {
    bottom_margin = '4vh';
  };

  $('.headline-wrap').animate({ marginBottom: bottom_margin }, 1000, 'swing');
  $('.product-wrap').animate({ marginBottom: bottom_margin }, 1000, 'swing');
})

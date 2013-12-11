'use strict';

// -----------------------
//    INVOICE EFFECT
// -----------------------
var inputInUse = false;
function writeInputTop(text) {
  // Timeout Animation
  var timeOut = setTimeout(function(){
    if (text.length > 0) {
      // Get previous text and insert the new one
      var previous = $('#search-input').text();
      $('#search-input').text(previous + text.charAt(0));

      // Call another time the text
      text = text.substring(1);
      writeInputTop(text);
    } else {
      // Stop the effect
      inputInUse = false;
      clearTimeout(timeOut);
    }
  },100);
}


// -----------------------
//    ONEPAGE-SCROLL
// -----------------------



function initOnePageScroll() {
  // Style string for no overflow
  var onePasgeCSS = 'body, html {margin: 0; overflow: hidden; -webkit-transition: opacity 400ms; -moz-transition: opacity 400ms;transition: opacity 400ms;}';
  onePasgeCSS += 'body, .onepage-wrapper, html { display: block;position: static;padding: 0;width: 100%;height: 100%;}';
  
  // Inject the css into the DOM
  var node = document.createElement('style');
  node.innerHTML = onePasgeCSS;
  document.body.appendChild(node);


  // Init the Onepage-scroll plugin
  var lastCurrentIndex;

  $('.main').onepage_scroll({
    sectionContainer: 'section',
    easing: 'ease',
    animationTime: 1000,
    pagination: true,
    updateURL: false,
    loop: false,
    beforeMove: function (index) {

      if (index !== 1) {
        $('#search-input').text('');
      }
    },
    afterMove: function (index) {
      var key = $('.active').data('index');
      if(lastCurrentIndex !== index){
        lastCurrentIndex = index;
        ga('send', 'event', 'landingHome', 'slide', index+'--'+key);

        if ($('body').hasClass('viewing-page-1') && !inputInUse) {
          inputInUse = true;
          $('#search-input').text('');
          writeInputTop('Invoice 421');
        }
      }
    }
  });
}


// -----------------------
//        MAIN
// -----------------------
$(function() {
  if ($(window).width() > 600 && $(window).height() > 500) {
    initOnePageScroll();
  }
  writeInputTop('Invoice 421');
});

// Subscription form
$(function() {
  var keyNotPressed = true;
  $('#subscribe').submit(function(){
    $.post(
      $(this).attr('action'),
      $(this).serialize(),
      function()
      {
        $('#subscribe').hide();
        $('#subscribe-ok').show();
        ga('send','event','landingHome','submit');
      }
    );

    return false;
  });

  $('#email-field').focus(function(){
    ga('send','event','landingHome','focus');
  }).keydown(function(){
    if(keyNotPressed) {
      ga('send','event','landingHome','typing');
      keyNotPressed = false;
    }
  });
});

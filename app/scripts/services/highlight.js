'use strict';

angular.module('anyfetchFrontApp.highlightService', [])
.factory('HighlightService', function() {

  var data = {
    current_index : null,
    options : {
      element : '.hlt',
      hover_element : 'hlt_active',
      duration : 300,
      offset : 20,
      iframe_element : '#iframe',
      page_container : '#page-container',
      container : '.details:eq(0)',
      next_button: '#highlight_next',
      previous_button: '#highlight_previous'
    }
  };

  data.next = function() {
    if(data.getMaxIndex() === 0) {
      return false;
    }
    var next_index = 0;
    if(data.current_index !== null) {
      if(next_index < data.getMaxIndex()) {
        next_index = data.current_index + 1;
      }
    }
    data.current_index = next_index;
    data.navigate();
  };

  data.previous = function() {
    if(data.getMaxIndex() === 0) {
      return false;
    }
    var previous_index = data.getMaxIndex() - 1;
    if(data.current_index !== null) {
      if(previous_index > 0 && data.current_index > 0) {
        previous_index = data.current_index - 1;
      }
    }
    data.current_index = previous_index;
    data.navigate();
  };

  data.navigate = function() {

    data.getRootContainer().find(data.options.element).removeClass(data.options.hover_element);
    data.getElement().addClass(data.options.hover_element);
    data.getRootContainer().scrollTo(
      data.getTopPosition(),
      data.options.duration,
      {offset: {top: data.options.offset}}
    );
  };

  data.getRootContainer = function() {
    if(data.options.iframe_element !== null) {
      return $(data.options.container).find(data.options.iframe_element).contents();
    }
    else{
      return $(data.options.container);
    }
  };

  data.getTextPosition = function() {
    if(data.getMaxIndex() > 0) {
      return (data.current_index + 1 ).toString() + ' of ' + data.getMaxIndex().toString();
    }
    else{
      return '';
    }
  };

  data.getTextOccurences = function() {
    if(data.getMaxIndex() === 1) {
      return 'One occurrence';
    }
    else{
      return data.getMaxIndex() + ' times';
    }
  };

  data.getTopPosition = function() {
    return data.getElement().offset().top - data.options.offset ;
  };

  data.getElement = function() {
    var el = data.getRootContainer().find(data.options.element + ':eq(' + data.current_index + ')');
    if(el.length === 0 && data.getMaxIndex() > 0) {
      data.current_index = 0;
      el = data.getRootContainer().find(data.options.element + ':eq(0)');
    }
    return el;
  };

  data.getMaxIndex = function() {
    return data.getRootContainer().find(data.options.element).length;
  };

  data.reset = function() {
    data.current_index = null;
  };

  // Return of the service
  return data;

});

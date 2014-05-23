'use strict';

angular.module('anyfetchFrontApp.highlightService', [])
.factory('HighlightService', function() {

  var datas = {
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

  datas.next = function(){
    if(datas.getMaxIndex() === 0){
      return false;
    }
    var next_index = 0;
    if(datas.current_index !== null){
      if(next_index < datas.getMaxIndex()){
        next_index = datas.current_index + 1;
      }
    }
    datas.current_index = next_index;
    datas.navigate();
  };

  datas.previous = function(){
    if(datas.getMaxIndex() === 0){
      return false;
    }
    var previous_index = datas.getMaxIndex() - 1;
    if(datas.current_index !== null){
      if(previous_index > 0 && datas.current_index > 0){
        previous_index = datas.current_index - 1;
      }
    }
    datas.current_index = previous_index;
    datas.navigate();
  };

  datas.navigate = function(){
    
    datas.getRootContainer().find(datas.options.element).removeClass(datas.options.hover_element);
    datas.getElement().addClass(datas.options.hover_element);
    datas.getRootContainer().scrollTo(
      datas.getTopPosition(),
      datas.options.duration,
      {offset: {top: datas.options.offset}}
    );
  };

  datas.getRootContainer = function(){
    if(datas.options.iframe_element !== null){
      return $(datas.options.container).find(datas.options.iframe_element).contents();
    }
    else{
      return $(datas.options.container);
    }
  };

  datas.getTextPosition = function(){
    if(datas.getMaxIndex() > 0){
      return (datas.current_index + 1 ).toString() + ' of ' + datas.getMaxIndex().toString();
    }
    else{
      return '';
    }
  };

  datas.getTextOccurences = function(){
    if(datas.getMaxIndex() === 1){
      return 'One occurence';
    }
    else{
      return datas.getMaxIndex() + ' times';
    }
  };

  datas.getTopPosition = function(){
    return datas.getElement().offset().top - datas.options.offset ;
  };

  datas.getElement = function(){
    var el = datas.getRootContainer().find(datas.options.element + ':eq(' + datas.current_index + ')');
    if(el.length === 0 && datas.getMaxIndex() > 0){
      datas.current_index = 0;
      el = datas.getRootContainer().find(datas.options.element + ':eq(0)');
    }
    return el;
  };

  datas.getMaxIndex = function(){
    return datas.getRootContainer().find(datas.options.element).length;
  };

  datas.reset = function(){
    datas.current_index = null;
  };

  // Return of the service
  return datas;

});
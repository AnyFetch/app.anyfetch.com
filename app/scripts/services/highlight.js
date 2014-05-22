'use strict';

angular.module('anyfetchFrontApp.highlightService', [])
.factory( 'HighlightService', function() {

  var datas = {
    current_index : null,
    options : {
      element : '.hlt',
      hover_element : 'hlt_active',
      duration : 300,
      offset : 0,
      page_container : '#page-container',
      container : '.details:eq(0)',
      next_button: '#hightlight_next',
      previous_button: '#hightlight_previous'
    }
  };

  datas.next = function(){
    var next_index = 0;
    if(datas.current_index !== null){
      if(next_index <= datas.getMaxIndex()){
        next_index = datas.current_index + 1;
      }
    }
    datas.current_index = next_index;
    datas.navigate();
  };

  datas.previous = function(){
    var previous_index = datas.getMaxIndex();
    if(datas.current_index !== null){
      if(previous_index > 0){
        previous_index = datas.current_index - 1;
      }
    }
    datas.current_index = previous_index;
    datas.navigate();
  };

  datas.navigate = function(){
    console.log(datas.current_index+'/'+datas.getMaxIndex());
    if(datas.getElement().length > 0){
      $(datas.options.container).find(datas.options.element).removeClass(datas.options.hover_element);
      datas.getElement().addClass(datas.options.hover_element);
      $(datas.options.container).scrollTo(
        datas.getTopPosition(),
        datas.options.duration,
        {offset: {top: datas.options.offset}}
      );
    }
    else{
      if(datas.getMaxIndex() > 0){
        datas.current_index = 0;
        datas.navigate();
      }
    }
    
  };

  datas.getTextPosition = function(){
    return (datas.current_index + 1 ).toString() + ' of ' + datas.getMaxIndex().toString();
  };

  datas.getTopPosition = function(){
    return datas.getElement().offset().top - $(datas.options.page_container).offset().top + 81;
  };

  datas.getElement = function(){
    return $(datas.options.container).find(datas.options.element + ':eq(' + datas.current_index + ')');
  };

  datas.getMaxIndex = function(){
    return $(datas.options.container).find(datas.options.element).length;
  };

  datas.reset = function(){
    datas.current_index = null;
  };

  // Return of the service
  return datas;

});
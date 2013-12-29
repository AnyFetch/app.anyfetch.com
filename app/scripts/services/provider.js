'use strict';

anyfetchFrontApp.factory( 'ProvidersService', function() {

  var datas = {
    providers: null
  };

  datas.set = function(providers) {
    angular.forEach(providers, function(value){
      value.search_count = 0;
      value.visible = true;
    });
    datas.providers = providers;
  };

  datas.updateSearchCounts = function(resultsCounts) {
    angular.forEach(datas.providers, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
    });
  };

  datas.get = function() {
    return datas.providers;
  };

  // Return of the service
  return datas;

});
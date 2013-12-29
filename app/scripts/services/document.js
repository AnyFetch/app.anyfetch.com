'use strict';

anyfetchFrontApp.factory( 'DocumentTypesService', function() {

  var datas = {
    documentTypes: null
  };

  datas.set = function(documentTypes) {
    angular.forEach(documentTypes, function(value, key){
      value.search_count = 0
      value.visible = true
    });
    datas.documentTypes = documentTypes;
  };

  datas.updateSearchCounts = function(resultsCounts) {
    angular.forEach(datas.documentTypes, function(value, key){
      if (resultsCounts[key]) {
        value.search_count = resultsCounts[key];
      } else {
        value.search_count = 0;
      }
    });
  }

  // datas.updateVisibility = function(id, visible) {
  //   datas.documentTypes[id].
  // }

  datas.get = function() {
    return datas.documentTypes;
  };

  // Return of the service
  return datas;

});
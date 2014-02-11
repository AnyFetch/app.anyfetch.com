'use strict';

angular.module('anyfetchFrontApp.documentService', [])
.factory( 'DocumentTypesService', function() {

  var datas = {
    documentTypes: null,
    nbDocTypes: 0
  };

  datas.set = function(documentTypes) {
    datas.documentTypes = documentTypes;
    datas.reset(true);
  };

  datas.reset = function(full) {
    angular.forEach(datas.documentTypes, function(value){
      if (full)
        value.search_count = 0;
      value.visible = true;
    });
  };

  datas.updateSearchCounts = function(resultsCounts) {
    datas.nbDocTypes = 0;
    angular.forEach(datas.documentTypes, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
      datas.nbDocTypes += nbResults ? nbResults : 0;
    });

    return datas.nbDocTypes;
  };

  datas.get = function() {
    return datas.documentTypes;
  };

  // Return of the service
  return datas;

});
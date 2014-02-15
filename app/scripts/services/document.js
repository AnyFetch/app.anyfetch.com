'use strict';

angular.module('anyfetchFrontApp.documentService', [])
.factory( 'DocumentTypesService', function() {

  var datas = {
    documentTypes: {
      list: null,
      totalCount: 0
    }
  };

  datas.set = function(documentTypes) {
    datas.documentTypes.list = documentTypes;
    datas.reset(true);
  };

  datas.reset = function(full) {
    angular.forEach(datas.documentTypes.list, function(value){
      if (full) {
        value.search_count = 0;
      }
      value.visible = true;
    });
  };

  datas.updateSearchCounts = function(resultsCounts) {
    datas.documentTypes.totalCount = 0;
    angular.forEach(datas.documentTypes.list, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
      datas.documentTypes.totalCount += nbResults ? nbResults : 0;
    });

    return datas.documentTypes.totalCount;
  };

  datas.get = function() {
    return datas.documentTypes;
  };

  // Return of the service
  return datas;

});
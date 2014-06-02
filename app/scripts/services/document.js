'use strict';

angular.module('anyfetchFrontApp.documentService', [])
.factory( 'DocumentTypesService', function() {

  var data = {
    documentTypes: {
      list: null,
      states: null,
      totalCount: 0,
      filtered: false
    }
  };

  data.set = function(documentTypes) {
    data.documentTypes.list = documentTypes;
    data.documentTypes.states = {};
    data.reset(true);
  };

  data.reset = function(full) {
    data.documentTypes.filtered = false;
    angular.forEach(data.documentTypes.list, function(value, index){
      if (full) {
        value.search_count = 0;
      }
      data.documentTypes.states[index] = true;
    });
  };

  data.updateSearchCounts = function(resultsCounts) {
    data.documentTypes.totalCount = 0;
    angular.forEach(data.documentTypes.list, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
      data.documentTypes.totalCount += nbResults ? nbResults : 0;
    });

    return data.documentTypes.totalCount;
  };

  data.get = function() {
    return data.documentTypes;
  };

  // Return of the service
  return data;

});

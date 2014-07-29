'use strict';

angular.module('anyfetchFrontApp.documentService', [])
.factory('DocumentTypesService', function() {

  var data = {
    documentTypes: {
      list: null,
      states: null,
      totalCount: 0,
      filtered: false
    }
  };

  data.set = function(documentTypes) {
    var documentTypesHash = {};
    documentTypes.forEach(function(documentType) {
      documentTypesHash[documentType.id] = documentType;
    });
    data.documentTypes.list = documentTypesHash;
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
    var resultsCountsHash = {};
    resultsCounts.forEach(function (resultCount) {
      resultsCountsHash[resultCount.id] = resultCount;
    });

    data.documentTypes.totalCount = 0;
    angular.forEach(data.documentTypes.list, function(value, key){
      var nbResults = resultsCountsHash[key] ? resultsCountsHash[key].document_count : 0;
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

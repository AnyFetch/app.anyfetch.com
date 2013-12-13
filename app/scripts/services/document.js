'use strict';

anyfetchFrontApp.factory( 'DocumentTypesService', function() {
  
  var datas = {
    documentTypes: null
  };

  datas.set = function(documentTypes) {
    datas.documentTypes = documentTypes;
  };

  datas.get = function() {
    return datas.documentTypes;
  };

  // Return of the service
  return datas;

});
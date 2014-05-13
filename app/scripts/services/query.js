'use strict';

angular.module('anyfetchFrontApp.queryService', [])
.factory( 'QueryService', function($q, DocumentTypesService, ProvidersService, TimeService) {

  var datas = {
  };

  datas.queryBuilder = function(query, similar_to, start, limit) {
    var apiQuery;

    if (similar_to) {
      apiQuery = API_URL + '/documents/'+similar_to+'/similar?start='+start+'&limit='+limit;
    } else if (query) {
      apiQuery = API_URL + '/documents?search='+query+'&start='+start+'&limit='+limit;

      apiQuery = datas.filters(apiQuery);
    }

    return apiQuery;
  };

  datas.filters = function(apiQuery) {
    var argsDocs = '';
    var argsProv = '';
    var newQuery = apiQuery;
    var documentTypes = DocumentTypesService.documentTypes;
    var providers = ProvidersService.providers;

    documentTypes.filtered = false;
    providers.filtered = false;

    angular.forEach(Object.keys(documentTypes.list), function(value){
      var docType = documentTypes.list[value];
      if (!documentTypes.states[value]) {
        documentTypes.filtered = true;
      } else if (docType.search_count !== 0) {
        argsDocs += '&document_type='+value;
      }
    });

    if (documentTypes.filtered && argsDocs.length) {
      newQuery += argsDocs;
    } else if (documentTypes.filtered && !argsDocs.length) {
      return '';
    }

    angular.forEach(Object.keys(providers.list), function(value){
      var prov = providers.list[value];
      if (!providers.states[value]) {
        providers.filtered = true;
      } else if (prov.search_count !== 0) {
        argsProv += '&token='+value;
      }
    });

    if (providers.filtered && argsProv.length) {
      newQuery += argsProv;
    } else if (providers.filtered && !argsProv.length) {
      return '';
    }

    if (TimeService.getAfter()) {
      var argsTime = '&after='+TimeService.getAfter();
      argsTime += '&before='+TimeService.getBefore();

      newQuery += argsTime;
    }

    return newQuery;
  };

  // Return of the service
  return datas;

});

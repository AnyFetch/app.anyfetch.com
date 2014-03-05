'use strict';

angular.module('anyfetchFrontApp.providerService', [])
.factory( 'ProvidersService', function($q, $http, $timeout) {

  var serverTime = null;
  var updateFreq = 10000;
  var datas = {
    providers: {
      list: null,
      states: null,
      totalCount: 0,
      filtered: false
    },
    providersUpToDate: null
  };

  var checkProviderStatus = function () {
    serverTime += updateFreq;
    var providerStatusTmp = true;

    angular.forEach(datas.providers.list, function(value){
      var updateProvider = new Date(value.updated).getTime() + 2 * 60 * 1000;
      var status = updateProvider < serverTime;
      value.upToDate = status;

      if (!status) {
        providerStatusTmp = false;
      }
    });

    datas.providersUpToDate = providerStatusTmp;
    $timeout(checkProviderStatus, updateFreq);
  };

  datas.set = function(providers, time) {
    datas.providers.list = providers;
    datas.providers.states = {};
    datas.reset(true);
    serverTime = new Date(time).getTime();

    checkProviderStatus();
  };

  datas.reset = function(full) {
    datas.providers.filtered = false;
    angular.forEach(datas.providers.list, function(value, index){
      if (full) {
        value.search_count = 0;
      }

      datas.providers.states[index] = true;
    });
  };

  datas.updateSearchCounts = function(resultsCounts) {
    datas.providers.totalCount = 0;
    angular.forEach(datas.providers.list, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
      datas.providers.totalCount += nbResults ? nbResults : 0;
    });

    return datas.providers.totalCount;
  };

  datas.update = function() {
    var deferred = $q.defer();

    $http({method: 'POST', url: API_URL + '/update'})
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  datas.get = function() {
    return datas.providers;
  };

  return datas;

});

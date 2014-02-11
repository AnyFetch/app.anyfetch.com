'use strict';

angular.module('anyfetchFrontApp.providerService', [])
.factory( 'ProvidersService', function($q, $http, $timeout) {

  var serverTime = null;
  var updateFreq = 10000;
  var datas = {
    providers: null,
    nbProv: 0,
    providersUpToDate: null
  };

  var checkProviderStatus = function () {
    serverTime += updateFreq;
    var providerStatusTmp = true;

    angular.forEach(datas.providers, function(value){
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
    angular.forEach(providers, function(value){
      value.search_count = 0;
      value.visible = true;
    });
    datas.providers = providers;
    serverTime = new Date(time).getTime();

    checkProviderStatus();
  };

  datas.updateSearchCounts = function(resultsCounts) {
    datas.nbProv = 0;
    angular.forEach(datas.providers, function(value, key){
      var nbResults = resultsCounts[key];
      value.search_count = nbResults ? nbResults : 0;
      datas.nbProv += nbResults ? nbResults : 0;
    });

    return datas.nbProv;
  };

  datas.update = function() {
    var deferred = $q.defer();

    $http({method: 'POST', url: 'http://api.anyfetch.com/update'})
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  datas.get = function() {
    return datas.providers;
  };

  return datas;

});

'use strict';

angular.module('anyfetchFrontApp.providerService', [])
.factory( 'ProvidersService', function($q, $http, $timeout) {

  var serverTime = null;
  var updateFreq = 10000;
  var data = {
    providers: {
      list: null,
      states: null,
      totalCount: 0,
      filtered: false
    },
    providersUpToDate: null
  };

  var checkProviderStatus = function() {
    serverTime += updateFreq;
    var providerStatusTmp = true;

    angular.forEach(data.providers.list, function(value) {
      var updateProvider = new Date(value.updated).getTime() + 2 * 60 * 1000;
      var status = updateProvider < serverTime;
      value.upToDate = status;

      if(!status) {
        providerStatusTmp = false;
      }
    });

    data.providersUpToDate = providerStatusTmp;
    $timeout(checkProviderStatus, updateFreq);
  };

  data.set = function(providers, time) {
    var providersHash = {};
    providers.forEach(function(provider) {
      providersHash[provider.id] = provider;
    });

    data.providers.list = providersHash;
    data.providers.states = {};
    data.reset(true);
    serverTime = new Date(time).getTime();

    checkProviderStatus();
  };

  data.reset = function(full) {
    data.providers.filtered = false;
    angular.forEach(data.providers.list, function(value, index) {
      if(full) {
        value.search_count = 0;
      }

      data.providers.states[index] = true;
    });
  };

  data.updateSearchCounts = function(resultsCounts) {
    var resultsCountsHash = {};
    resultsCounts.forEach(function (resultCount) {
      resultsCountsHash[resultCount.id] = resultCount;
    });


    data.providers.totalCount = 0;
    angular.forEach(data.providers.list, function(value, key) {
      var nbResults = resultsCountsHash[key] ? resultsCountsHash[key].document_count : 0;
      value.search_count = nbResults ? nbResults : 0;
      data.providers.totalCount += nbResults ? nbResults : 0;
    });

    return data.providers.totalCount;
  };

  data.update = function() {
    var deferred = $q.defer();

    $http({method: 'POST', url: API_URL + '/company/update'})
      .success(deferred.resolve)
      .error(deferred.reject);

    return deferred.promise;
  };

  data.get = function() {
    return data.providers;
  };

  data.getAvailableProviders = function() {
    var deferred = $q.defer();

    if(data.availableProviders) {
      deferred.resolve(data.availableProviders);
    } else {
      $http.get('http://manager.anyfetch.com/marketplace.json?trusted=true')
        .success(function(res) {
          for(var provider in res) {
            var id = res[provider].id;
            res[provider].id = id;
          }

          data.availableProviders = res;
          deferred.resolve(res);
        })
        .error(deferred.reject);
    }

    return deferred.promise;
  };

  return data;

});

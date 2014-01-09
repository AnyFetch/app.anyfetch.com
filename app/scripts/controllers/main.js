'use strict';


// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {

  $scope.search = function(query) {
    if (query.length) {
      $location.search({q: query});
    } else {
      console.log('REtour home!');
      $location.search({});
      $scope.results = [];
      $scope.documentTypes = DocumentTypesService.updateSearchCounts($scope.results);
      $scope.providersStatus = ProvidersService.updateSearchCounts($scope.results);
    }
  };

  $scope.getRes = function (query, start, limit) {
    var deferred = $q.defer();

    var apiQuery = 'http://api.anyfetch.com/documents?search='+query+'&start='+start+'&limit='+limit;

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        DocumentTypesService.updateSearchCounts(data.document_types);
        ProvidersService.updateSearchCounts(data.tokens);
        $scope.loading = false;
        
        if (data.datas.length === limit) {
          $scope.lastRes = start+limit;
          $scope.moreResult = true;
        } else {
          $scope.lastRes = start+data.datas.length;
          $scope.moreResult = false;
        }
        deferred.resolve(data);
      })
      .error(deferred.reject);

    return deferred.promise;
  };

  $scope.focusSearch = function() {
    $('#search').focus();
  };

  $scope.loadMore = function() {
    $scope.loading = true;

    $scope.getRes($scope.query, $scope.lastRes, 5)
      .then(function(data) {
        $scope.results = $scope.results.concat(data.datas);
      });
  };

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };

  $rootScope.loginPage = false;
  $scope.user = AuthService.currentUser;
  $scope.query  = $location.search().q || '';

  $scope.results = [];
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;
  $scope.providersStatus = ProvidersService.providersUpToDate;

  if ($scope.query) {
    $scope.loading = true;

    $scope.getRes($scope.query, 0, 5)
      .then(function(data) {
        $scope.results = data.datas;
      });
  }

});
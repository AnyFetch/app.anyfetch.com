'use strict';


// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {

  $scope.search = function(query) {
    $location.search({q: query});
    $scope.getRes($scope.query, 0, 2)
        .then(function(data) {
          $scope.results = data.datas;
        });
  };

  $scope.getRes = function (query, start, limit) {
    var deferred = $q.defer();

    var apiQuery = 'http://api.anyfetch.com/documents?search='+query+'&start='+start+'&limit='+limit;

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        DocumentTypesService.updateSearchCounts(data.document_types);
        ProvidersService.updateSearchCounts(data.tokens);
        $scope.loading = false;
        $scope.lastRes = start+limit;
        $scope.moreResult = true;
        deferred.resolve(data);
      })
      .error(deferred.reject);

    return deferred.promise;
  };

  $scope.loadMore = function() {
    $scope.getRes($scope.query, $scope.lastRes, 2)
      .then(function(data) {
        $scope.results = $scope.results.concat(data.datas);
      });
  };

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };

  $scope.displayFull = function(id) {
    var apiQuery = 'http://api.anyfetch.com/documents/' + id;

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        $scope.full = data;
        var actualSearch = $location.search();
        actualSearch.id = id;
        $location.search(actualSearch);
        $scope.modalShow = true;
      });

  };

  $scope.$watch('modalShow', function(newValue, oldValue) {
    if (!newValue && oldValue) {
      var actualSearch = $location.search();
      delete actualSearch.id;
      $location.search(actualSearch);
    }
  });

  $rootScope.loginPage = false;
  $scope.modalShow = false;
  $scope.user = AuthService.currentUser;
  $scope.query  = $location.search().q || '';

  $scope.results = [];
  $scope.full = null;
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;
  $scope.providersStatus = ProvidersService.providersUpToDate;

  if ($scope.query) {
    $scope.loading = true;

    $scope.getRes($scope.query, 0, 2)
      .then(function(data) {
        $scope.results = data.datas;
      });
  }

  if ($location.search().id) {
    var apiQuery = 'http://api.anyfetch.com/documents/' + $location.search().id;

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        $scope.full = data;
        $scope.modalShow = true;
      });
  }

});
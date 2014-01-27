'use strict';


// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {

  $scope.search = function(query) {
    if (query.length) {
      $scope.loading = true;
      $scope.firstSearch = false;
      $location.search({q: query});
      $scope.getRes($scope.query, 0, 5)
          .then(function(data) {
            $scope.results = data.datas;
            $scope.loading = false;
          });
    } else {
      $location.search({});
      $scope.results = [];
      DocumentTypesService.updateSearchCounts([]);
      ProvidersService.updateSearchCounts([]);
      $scope.moreResult = false;
    }
  };
  $scope.close_similar = function(){
    if ($location.search().similar_to) {
      var actualSearch = $location.search();
      delete actualSearch.similar_to;
      $location.search(actualSearch);
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

  $scope.displayFull = function(id) {
    var apiQuery = 'http://api.anyfetch.com/documents/' + id;
    if ($scope.query) {
      apiQuery += '?search=' + $scope.query;
    }

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        $scope.full = data;
        $scope.modalShow = true;

        if (!$location.search().id) {
          var actualSearch = $location.search();
          actualSearch.id = id;
          $location.search(actualSearch);
        }
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
  $scope.firstSearch = true;
  $scope.similarShow = false;

  $scope.results = [];
  $scope.full = null;
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

  $scope.$on('$routeUpdate', function(){
    if ($location.search().id) {
      $scope.displayFull($location.search().id);
    }
    if ($location.search().similar_to) {
      $scope.similarShow = true;
      // Change endpoint
    }
    else{
      $scope.similarShow = false;
      // Change endpoint
    }
  });




});
'use strict';


// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {
  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
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

        if (data.datas.length === limit) {
          $scope.lastRes = start+limit;
          $scope.moreResult = true;
        } else {
          $scope.lastRes = start+data.datas.length;
          $scope.moreResult = false;
        }
        deferred.resolve(data);
      })
      .error(function() {
        $scope.display_error('Error while searching '+ query +'. Please reload.');
        deferred.reject();
      });

    return deferred.promise;
  };

  $scope.searchLunch = function(query) {
    console.log('Search lunched!');
    $location.search({q: query});
    $scope.searchUpdate();
  };

  $scope.searchUpdate = function() {
    console.log('Search updating!');
    $scope.query = $location.search().q || '';
    $scope.search();
  };

  $scope.search = function() {
    $scope.loading = true;
    $scope.results = [];

    if ($scope.query.length) {
      $scope.getRes($scope.query, 0, 5)
        .then(function(data) {
          $scope.results = data.datas;
          $scope.loading = false;
        });
    } else {
      $scope.query = '';
      $location.search({});
      $scope.loading = false;
      DocumentTypesService.updateSearchCounts([]);
      ProvidersService.updateSearchCounts([]);
      $scope.moreResult = false;
    }
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

  $scope.displayFull = function(id) {
    var actualSearch = $location.search();
    actualSearch.id = id;
    $location.search(actualSearch);
  };

  $scope.loadFull = function() {
    if ($scope.id) {
      var apiQuery = 'http://api.anyfetch.com/documents/'+ $scope.id;
      if ($scope.query) {
        apiQuery += '?search=' + $scope.query;
      }

      $scope.modalShow = true;
      //LOCK SCROLL MAIN!!!
      $scope.full = null;

      $http({method: 'GET', url: apiQuery})
        .success(function(data) {
          if($location.search().id) {
            $scope.full = data;
            $scope.modalShow = true;
            $scope.modalLoading = false;
          }
        })
        .error(function() {
          $scope.display_error('Error while loading full preview of the document '+$scope.id);
          $scope.searchLunch($scope.query);
        });
    }
    else {
      console.log('Nothing to display in full.');
    }
  };

  $scope.close_similar = function(){
    if ($location.search().similar_to) {
      var actualSearch = $location.search();
      delete actualSearch.similar_to;
      $location.search(actualSearch);
    }
  };

  $scope.close_error = function(){
    $scope.errorMes = '';
  };

  $scope.display_error = function(mes){
    $scope.errorMes = mes;
    $('body').scrollTop(0);
    setTimeout($scope.close_error, 1500);
  };

  $scope.$watch('modalShow', function(newValue, oldValue) {
    if (!newValue && oldValue) {
      $scope.closeModal = true;
      var actualSearch = $location.search();
      delete actualSearch.id;
      $location.search(actualSearch);
    }
  });

  $scope.$on('$routeUpdate', function() {
    $scope.rootUpdate();
  });

  $scope.rootUpdate = function() {
    $scope.id  = $location.search().id || '';
    $scope.similar_to = $location.search().similar_to || '';
    
    if ($scope.id) {
      $scope.modalLoading = true;
      $scope.loadFull();
      //LOCK SCROLL MAIN!!!
    }
    else {
      $scope.loading = true;
      $scope.modalShow = false;

      if ($scope.similar_to) {
        $scope.similarShow = true;
        // Similar endpoint Query
      }
      else {
        $scope.similarShow = false;

        if (!$scope.query || $scope.query !== $location.search().q) {
          $scope.searchUpdate();
        } else if ($scope.closeModal) {
          $scope.loading = false;
          $scope.closeModal = false;
        }
      }
    }
  };

  $rootScope.loginPage = false;
  $scope.modalShow = false;
  $scope.user = AuthService.currentUser;
  $scope.similarShow = false;

  $scope.results = [];
  $scope.full = null;
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;
  $scope.providersStatus = ProvidersService.providersUpToDate;
  
  $scope.rootUpdate();
});
'use strict';


// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };

  $scope.focusSearch = function() {
    $('#search').focus();
  };

  $scope.getRes = function(start, limit) {
    var deferred = $q.defer();
    var apiQuery;

    if ($scope.similar_to) {
      apiQuery = 'http://api.anyfetch.com/documents/'+$scope.similar_to+'/similar?start='+start+'&limit='+limit;
    } else if ($scope.query) {
      apiQuery = 'http://api.anyfetch.com/documents?search='+$scope.query+'&start='+start+'&limit='+limit;

      apiQuery = $scope.filterDoc(apiQuery);
    }

    if (apiQuery !== undefined) {
      $http({method: 'GET', url: apiQuery})
        .success(function(data) {
          console.log('Data recieved from search: ', data);

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
          if ($scope.similar_to) {
            $scope.display_error('Error while searching for similar documents of '+ $scope.similar_to +'. Please restart your search.');
            $location.search({});
          } else {
            $scope.display_error('Error while searching '+ $scope.query +'. Please reload.');
          }
          deferred.reject();
        });
    } else {
      $scope.display_error('No query or similar documents found. Please retry your search.');
    }

    return deferred.promise;
  };

  $scope.filterDoc = function(apiQuery) {
    var args = '';
    var hasFilter = false;

    angular.forEach(Object.keys($scope.documentTypes), function(value){
      var docType = $scope.documentTypes[value];
      if (!docType.visible) {
        hasFilter = true;
      } else if (docType.search_count !== 0) {
        args += '&document_type='+value;
      }
    });

    if (hasFilter) {
      console.log(args);
      return apiQuery+args;
    }

    return apiQuery;
  };

  $scope.searchLaunch = function(query) {
    $location.search({q: query});
    DocumentTypesService.set($scope.documentTypes);
    ProvidersService.set($scope.providers);
    DocumentTypesService.updateSearchCounts([]);
    ProvidersService.updateSearchCounts([]);
    $scope.searchUpdate();
  };

  $scope.searchUpdate = function() {
    $scope.query = $location.search().q || '';
    $scope.search();
  };

  $scope.search = function() {
    $scope.loading = true;
    $scope.results = [];

    if ($scope.query.length) {
      $scope.getRes(0, 5)
        .then(function(data) {
          $scope.resultUpdate(data);
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

  $scope.similarUpdate = function() {
    $scope.similar_to = $location.search().similar_to || '';
    $scope.similar();
  };

  $scope.similar = function() {
    $scope.similarShow = true;

    $scope.similarLoading = true;
    $scope.getFull('http://api.anyfetch.com/documents/'+ $scope.similar_to);

    $scope.loading = true;
    $scope.results = [];

    if ($scope.similar_to.length) {
      $scope.getRes(0, 5)
        .then(function(data) {
          $scope.resultUpdate(data);
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

  $scope.close_similar = function(){
    $scope.similar_info = undefined;
    $scope.similar_to = undefined;
    
    var actualSearch = $location.search();
    delete actualSearch.similar_to;
    $scope.query = undefined;
    $location.search(actualSearch);
  };

  $scope.update = function() {
    $scope.loading = true;

    $scope.getRes(0, 5)
      .then(function(data) {
        $scope.results = data.datas;
        $scope.loading = false;
      });
  };

  $scope.loadMore = function() {
    $scope.loading = true;

    $scope.getRes($scope.lastRes, 5)
      .then(function(data) {
        $scope.results = $scope.results.concat(data.datas);
        $scope.loading = false;
      });
  };

  $scope.resultUpdate = function(data) {
    $scope.results = data.datas;
    DocumentTypesService.updateSearchCounts(data.document_types);
    ProvidersService.updateSearchCounts(data.tokens);
    $scope.loading = false;
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
      $('body').addClass('lock');

      $scope.full = null;

      $scope.getFull(apiQuery);
    }
    else {
      $scope.display_error('Nothing to display in full.');
    }
  };

  $scope.getFull = function(apiQuery) {
    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        if($location.search().id) {
          $scope.full = data;
          $scope.modalLoading = false;
        } else if ($scope.similar_to) {
          $scope.similar_info = data;
          $scope.similarLoading = false;
        }
      })
      .error(function() {
        $scope.display_error('Error while loading full preview of the document '+$scope.id);
        $scope.searchLaunch($scope.query);
      });
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
    
    if ($scope.id) {
      $scope.modalLoading = true;
      $scope.loadFull();
      //LOCK SCROLL MAIN!!!
    }
    else {
      $scope.loading = true;
      $scope.modalShow = false;

      if ($location.search().similar_to) {
        if (!$scope.similar_to || $scope.similar_to !== $location.search().similar_to) {
          $scope.similarUpdate();
        }
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
  $scope.Object = Object;

  $scope.results = [];
  $scope.full = null;
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;
  $scope.providersStatus = ProvidersService.providersUpToDate;
  
  $scope.rootUpdate();
});
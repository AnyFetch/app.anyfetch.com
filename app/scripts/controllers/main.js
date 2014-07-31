'use strict';


// ------------------------------------------------------
//                  MainCrtl
// Controller managing the front.
// ------------------------------------------------------

// Number of result returned by each queries
var DEFAULT_LIMIT = 20;

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function($scope, $rootScope, $location, $http, $q, AuthService, DocumentTypesService, HighlightService, ProvidersService, TimeService, QueryService) {

// ------------------------------------------------------
//                  Variables
// ------------------------------------------------------

  $rootScope.loginPage = false;
  $scope.modalShow = false;
  $scope.providerShow = false;
  $scope.filterUpdate = false;
  $scope.user = AuthService.currentUser;
  $scope.similarShow = false;
  $scope.Object = Object;

  // Position of the last result returned with getRes
  $scope.lastRes = 0;

  // Launch Uservoice (but not in tests)
  if(window.initUserVoice) {
    window.initUserVoice();
  }

  $scope.results = [];
  $scope.full = null;
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;
  $scope.providersStatus = ProvidersService.providersUpToDate;
  $scope.times = TimeService.times;


// ------------------------------------------------------
//                  Query
// ------------------------------------------------------

  $scope.getRes = function(start, limit) {
    var deferred = $q.defer();
    var apiQuery = QueryService.queryBuilder($scope.query, $scope.similar_to, start, limit);

    if(apiQuery === '') {
      $scope.results = [];
      $scope.moreResult = false;
      $scope.loading = false;
      $scope.filterUpdate = false;
      deferred.reject();
    } else if(apiQuery !== undefined) {
      $http({method: 'GET', url: apiQuery})
        .success(function(data) {

          if(data.data.length === limit) {
            $scope.lastRes = start + limit;
            $scope.moreResult = true;
          } else {
            $scope.lastRes = start + data.data.length;
            $scope.moreResult = false;
          }
          $scope.filterUpdate = false;

          deferred.resolve(data);
        })
        .error(function(error) {
          console.error(error);
          $scope.display_error('Error '+ error.code +': '+ error.message +'. Please restart your search.');
          if($scope.similar_to) {
            $location.search({});
          }
          deferred.reject();
        });
    } else {
      $scope.display_error('No query or similar documents found. Please retry your search.');
    }

    return deferred.promise;
  };

  // The full argument define whether the filter needs to be updated or not
  $scope.resultUpdate = function(data, full) {
    $scope.results = data.data;

    if(full) {
      $scope.updateFiltersCount(data.facets.document_types, data.facets.providers, data.facets.creation_dates);
    }

    $scope.loading = false;
  };

// ------------------------------------------------------
//                  Search
// ------------------------------------------------------

  $scope.searchLaunch = function(query) {
    $location.search({q: query});
    $scope.updateFiltersCount([], [], []);
    $scope.searchUpdate();
  };

  $scope.searchUpdate = function() {
    $scope.query = $location.search().q || '';
    $scope.search(true);
  };

  // The full argument define whether the filter needs to be updated or not
  $scope.search = function(full) {
    $scope.loading = true;
    $scope.results = [];

    if($scope.query.length) {
      $scope.getRes(0, DEFAULT_LIMIT)
        .then(function(data) {
          $scope.resultUpdate(data, full);
        });
    } else {
      $scope.resetSearch();
    }
  };

  $scope.loadMore = function() {
    $scope.loading = true;

    $scope.getRes($scope.lastRes, DEFAULT_LIMIT)
      .then(function(data) {
        $scope.results = $scope.results.concat(data.data);
        $scope.loading = false;
      });
  };

  $scope.resetSearch = function() {
    $scope.query = '';
    $location.search({});
    $scope.loading = false;
    $scope.updateFiltersCount([], [], []);
    $scope.moreResult = false;
  };

// ------------------------------------------------------
//                  Similar
// ------------------------------------------------------

  $scope.similarUpdate = function() {
    $scope.similar_to = $location.search().similar_to || '';
    $scope.similar();
  };

  $scope.similar = function() {
    $scope.similarShow = true;

    $scope.similarLoading = true;
    $scope.getFull(API_URL + '/documents/'+ $scope.similar_to);

    $scope.loading = true;
    $scope.results = [];

    if($scope.similar_to.length) {
      $scope.getRes(0, DEFAULT_LIMIT)
        .then(function(data) {
          $scope.resultUpdate(data, true);
        });
    } else {
      $scope.resetSearch();
    }
  };

  $scope.close_similar = function() {
    $scope.similar_info = undefined;
    $scope.similar_to = undefined;

    var actualSearch = $location.search();
    delete actualSearch.similar_to;
    $scope.query = undefined;
    $location.search(actualSearch);
  };

// ------------------------------------------------------
//                  Filters
// ------------------------------------------------------

  $scope.updateFiltersCount = function(docTypes, provs, times) {
    if(docTypes) {
      DocumentTypesService.updateSearchCounts(docTypes);
    }

    if(provs) {
      ProvidersService.updateSearchCounts(provs);
    }

    if(times) {
      TimeService.times = TimeService.set(times);
    }
  };

  // Watch filterUpdate to know wether the filter has changed and the results needs to be reloaded
  $scope.$watch('filterUpdate', function(newVal) {
    if(newVal) {
      // Update only if a query is launched!
      if($scope.query && $scope.query.length) {
        console.log('new search due to filters');
        $scope.search(false);
        // Binded with the filter directive
        $scope.filterUpdate = false;
      }
    }
  });

// ------------------------------------------------------
//                  Full (or modal)
// ------------------------------------------------------

  $scope.displayFull = function(id) {
    $('body').scrollTop(0);
    var iframe = ($('#iframe')[0].contentWindow || $('#iframe')[0].contentDocument);
    iframe.document.body.innerHTML = '';

    var actualSearch = $location.search();
    actualSearch.id = id;
    $location.search(actualSearch);
  };

  $scope.loadFull = function() {
    if($scope.id) {
      var apiQuery = API_URL + '/documents/'+ $scope.id;
      if($scope.query) {
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
        } else if($scope.similar_to) {
          $scope.similar_info = data;
          $scope.similarLoading = false;
        }
      })
      .error(function() {
        $scope.display_error('Error while loading full preview of the document ' + $scope.id);
        $scope.searchLaunch($scope.query);
      });
  };

  $scope.$watch('modalShow', function(newValue, oldValue) {
    if(!newValue && oldValue) {
      if($scope.results.length) {
        $scope.closeModal = true;
        var actualSearch = $location.search();
        delete actualSearch.id;
        $location.search(actualSearch);
      } else if(!$location.search().similar_to) {
        $scope.searchLaunch($location.search().q);
      }
    }
  });

// ------------------------------------------------------
//                  Error message
// ------------------------------------------------------

  $scope.display_error = function(mes) {
    $scope.errorMes = mes;
    $('body').scrollTop(0);
    setTimeout($scope.close_error, 1500);
  };

  $scope.close_error = function() {
    $scope.errorMes = '';
  };

// ------------------------------------------------------
//                  Route management
// ------------------------------------------------------

  $scope.$on('$routeUpdate', function() {
    $scope.routeUpdate();
  });

  $scope.routeUpdate = function() {
    $scope.id  = $location.search().id || '';

    if($scope.id) {
      $scope.modalLoading = true;
      $scope.loadFull();
      //LOCK SCROLL MAIN!!!
    }
    else {
      $scope.loading = true;
      $scope.modalShow = false;

      if($location.search().similar_to) {
        if(!$scope.similar_to || $scope.similar_to !== $location.search().similar_to) {
          $scope.similarUpdate();
          $scope.closeModal = true;
        }
      }
      else {
        $scope.similarShow = false;

        if(!$scope.query || $scope.query !== $location.search().q) {
          $scope.searchUpdate();
        } else if($scope.closeModal) {
          $scope.loading = false;
          $scope.closeModal = false;
        }
      }
    }
  };

// ------------------------------------------------------
//                  Misc
// ------------------------------------------------------

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };

  $scope.focusSearch = function() {
    $('#search').focus();
  };

// ------------------------------------------------------
//                  Init
// ------------------------------------------------------

  $scope.routeUpdate();
});

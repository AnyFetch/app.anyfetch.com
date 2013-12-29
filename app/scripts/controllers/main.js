'use strict';

// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

anyfetchFrontApp.controller('MainCtrl', function ($scope, $location, $http, $q, AuthService, DocumentTypesService, ProvidersService) {

  $scope.search = function(query) {
    $location.search({q: query});
  };

  $scope.getSnippets = function (query) {
    var deferred = $q.defer();

    var apiQuery = 'http://api.anyfetch.com/documents?search='+query+'&limit=50';

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
        DocumentTypesService.updateSearchCounts(data.document_types);
        ProvidersService.updateSearchCounts(data.tokens);
        $scope.loading = false;
        deferred.resolve(data);
      })
      .error(deferred.reject);

    return deferred.promise;
  };

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };


  $scope.user = AuthService.currentUser;
  $scope.query  = $location.search().q || '';

  $scope.results = [];
  $scope.documentTypes = DocumentTypesService.documentTypes;
  $scope.providers = ProvidersService.providers;

  if ($scope.query) {
    $scope.loading = true;

    $scope.getSnippets($scope.query)
      .then(function(data) {
        $scope.results = data.datas;
      });
  }

});
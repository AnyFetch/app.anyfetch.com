'use strict';

// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $location, $http, $q, AuthService, DocumentTypesService) {

  $scope.search = function(query) {
    $location.search({q: query});
  }
  
  $scope.getSnippets = function (query) {
    var deferred = $q.defer();

    var apiQuery = 'http://api.anyfetch.com/documents?search='+query+'&limit=50';

    $http({method: 'GET', url: apiQuery})
      .success(function(data) {
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
  $scope.query  = $location.search().q || "";

  $scope.results = [];

  if ($scope.query) {
    $scope.loading = true;

    $scope.getSnippets($scope.query)
      .then(function(data) {
        $scope.results = data.datas;
      });
  };

}).controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {

  $scope.rememberme = true;

  // Login the user to anyfetch
  $scope.login = function() {
    var credentials = {
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    };

    AuthService.login(credentials)
      .then(function(user) {
        if (user) {
          $location.path('/');
        }
      }, function() {
        $rootScope.error = 'Failed to login';
      });
  };

});
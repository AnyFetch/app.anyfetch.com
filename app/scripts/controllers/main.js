'use strict';

// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($scope, $location, AuthService) {

  $scope.user = AuthService.currentUser;
  
  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
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
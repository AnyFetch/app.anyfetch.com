'use strict';

// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function ($rootScope, $scope, $location, AuthService) {
  
  console.log(AuthService.currentUser);

  $scope.logout = function() {
    AuthService.logout(function() {
      $location.path('/login');
    });
  };

}).controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {

  $scope.rememberme = true;

  // Login the user to anyfetch
  $scope.login = function() {
    AuthService.login({
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    },
    function(user) {
      $rootScope.currentUser = user;
      $location.path('/');
    },
    function() {
      $rootScope.error = 'Failed to login';
    });
  };

});
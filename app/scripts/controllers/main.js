'use strict';

// ------------------------------------------------------
//                  MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
.controller('MainCtrl', function () {
}).controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {

  $scope.rememberme = true;

  // Login the user to anyfetch
  $scope.login = function() {
    AuthService.login({
      email: $scope.email,
      password: $scope.password,
      rememberme: $scope.rememberme
    },
    function() {
      $location.path('/');
    },
    function() {
      $rootScope.error = 'Failed to login';
    });
  };

});
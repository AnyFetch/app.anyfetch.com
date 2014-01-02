'use strict';

angular.module('anyfetchFrontApp')
.controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {

  $rootScope.loginPage = true;
  $scope.rememberMe = true;

  // Login the user to anyfetch
  $scope.login = function() {
    var credentials = {
      email: $scope.email,
      password: $scope.password,
      rememberMe: $scope.rememberMe
    };
    console.log(credentials);

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
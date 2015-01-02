'use strict';

angular.module('anyfetchFrontApp')
.controller('LoginCtrl', function($scope, $rootScope, $location, AuthService) {

  $rootScope.loginPage = true;
  $scope.rememberMe = true;

  // Login the user to anyfetch
  $scope.login = function() {
    var credentials = {
      token: $scope.token,
    };
    $scope.loadingLogin = true;

    AuthService.login(credentials)
      .then(function(user) {
        if(user) {
          $location.path('/');
          $scope.loadingLogin = false;
        }
      }, function() {
        $rootScope.error = 'Failed to login';
        $scope.loadingLogin = false;
      });
  };

  $scope.loadingLogin = false;

});

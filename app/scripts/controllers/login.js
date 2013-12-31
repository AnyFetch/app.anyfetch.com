'use strict';

anyfetchFrontApp.controller('LoginCtrl', function ($scope, $rootScope, $location, AuthService) {

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
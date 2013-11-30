'use strict';

angular.module('anyfetchFrontApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'anyfetchFrontApp.filters'
])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

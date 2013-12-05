'use strict';

//--------------------------------------------------------------
//                 Angular Main
//--------------------------------------------------------------

angular.module('anyfetchFrontApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'anyfetchFrontApp.filters'
])
  .config(function ($routeProvider, $sceProvider, $locationProvider) {
    $routeProvider
      .when('/app', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/app'
      });
    $sceProvider.enabled(false);
    $locationProvider.html5Mode(true);
  });

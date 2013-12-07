'use strict';

//--------------------------------------------------------------
//                 Angular Main
//--------------------------------------------------------------

angular.module('anyfetchFrontApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'anyfetchFrontApp.filters',
  'anyfetchFrontApp.directives',
  'anyfetchFrontApp.services'
])
  .config(function ($routeProvider, $sceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .otherwise({
        redirectTo: '/'
      });
    $sceProvider.enabled(false);
  });

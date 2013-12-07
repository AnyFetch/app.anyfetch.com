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
  .config(function ($routeProvider, $sceProvider, $httpProvider) {
    
    // Desable templating HTML protection for Mustache 
    $sceProvider.enabled(false);

    // Routing
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });

    // Redirection to the login page if request is unauthorized  
    var interceptor = function($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }

      return function(promise) {
        return promise.then(success, error);
      };
    };
    $httpProvider.responseInterceptors.push(interceptor);
  })
  .run(function ($rootScope, $location, AuthService) {

    $rootScope.$on('$routeChangeStart', function () {
      // Delete all routing errors
      $rootScope.error = null;

      // Check if the user is connected
      if( AuthService.isLoggedin() ) {
        $location.path('/');
      } else {
        $location.path('/login');
      }

    });
  });

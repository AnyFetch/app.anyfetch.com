'use strict';

angular.module('anyfetchFrontApp', [
  'ngCookies',
  'ngResource',
  'ngRoute',
  'anyfetchFrontApp.filters',
  'anyfetchFrontApp.gravatarDirective',
  'anyfetchFrontApp.snippetDirective',
  'anyfetchFrontApp.modalDirective',
  'anyfetchFrontApp.authenticationService',
  'anyfetchFrontApp.documentService',
  'anyfetchFrontApp.providerService'
])
  .config(function ($routeProvider, $sceProvider, $httpProvider) {

    // Disable templating HTML protection for Mustache
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
    var interceptor = ['$location', '$q', function($location, $q) {
      function success(response) {
        return response;
      }

      function error(response) {
        if(response.status === 401) {
          $location.path('/login');
          return $q.reject(response);
        }
        else {
          console.log('Error: ', response);
          return $q.reject(response);
        }
      }

      return function(promise) {
        return promise.then(success, error);
      };
    }];
    $httpProvider.responseInterceptors.push(interceptor);
  })
  .run(function (AuthService, $route, $q, $location, $rootScope) {

    var bootstrapApp = function() {
        var deferred = $q.defer();

        // Watch if the current user is connected
        AuthService.isLoggedin()
          .then(function(user) {
            deferred.resolve(user);
          }, function() {
            $location.path('/login');
            deferred.resolve();
          });

        return deferred.promise;
      };

    angular.forEach($route.routes,function(value, key) {
      if(key !== '/login' || key !== '/login/') {
        $route.routes[key].resolve = {};
        $route.routes[key].resolve.currentUser = bootstrapApp;
      }
    });

    $rootScope.$on('$viewContentLoaded', function () {
      $(document).foundation();
    });
  });

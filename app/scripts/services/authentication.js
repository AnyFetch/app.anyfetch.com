'use strict';

angular.module('anyfetchFrontApp.authenticationService', [])
.factory('AuthService', function($cookies, $cookieStore, $rootScope, $http, $q, DocumentTypesService, ProvidersService) {

  var data = {
    currentUser: null
  };

  var bootstrapUserContent = function(data) {
    DocumentTypesService.set(data['/document_types']);
    ProvidersService.set(data['/providers'], data['/'].server_time);
    ProvidersService.update();
  };

  // Login : Login the user using the basic method or the cookies credentials
  // return a promise methode
  data.login = function(user) {
    var deferred = $q.defer();

    var initializePage = function initializePage(token) {
      $http.defaults.headers.common.Authorization = 'Bearer ' + token;
      $http({method: 'GET', url: API_URL + '/batch?pages=/&pages=/document_types&pages=/providers'})
        .success(function(data) {
          data.currentUser = {
            email: data['/'].user_email,
            credentials: token
          };

          $cookies.credentials = token;

          bootstrapUserContent(data);

          deferred.resolve(data.currentUser);
        })
        .error(deferred.reject);
    };

    var basicCredentials;
    if(!user) {
      // Already logged
      initializePage($cookies.credentials);
    }
    else {
      // Create of the user credential
      basicCredentials = btoa(user.email + ':' + user.password);

      // Check the user credentials and retrieve a token
      $http({
        method: 'GET',
        url: API_URL + '/token',
        headers: {
          'Authorization': 'Basic ' + basicCredentials
        }
      })
        .success(function(data) {
          initializePage(data.token);
        })
        .error(deferred.reject);
    }

    return deferred.promise;
  };

  // Lougout : Lougout the current user
  data.logout = function() {
    console.log('loggin out');
    data.currentUser = null;
    $cookieStore.remove('credentials');
  };

  // isLoggedIn : check if a user is currently logged in
  // return a promise containing the user if it's resolved
  data.isLoggedin = function() {
    var deferred = $q.defer();

    if(data.currentUser) {
      deferred.resolve(data.currentUser);
    }
    else if($cookies.credentials) {
      data.login()
        .then(function(user) {
          console.log('Login ', user);
          data.currentUser = user;
          deferred.resolve(user);
        }, function() {
          $cookieStore.remove('credentials');
          deferred.reject();
        });
    }
    else {
      deferred.reject();
    }

    return  deferred.promise;
  };

  // Return of the service
  return data;

});

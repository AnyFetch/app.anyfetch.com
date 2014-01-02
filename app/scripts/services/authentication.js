'use strict';

angular.module('anyfetchFrontApp.authenticationService', [])
.factory( 'AuthService', function($cookies, $cookieStore, $rootScope, $http, $q, DocumentTypesService, ProvidersService) {

  var datas = {
    currentUser: null
  };

  var bootstrapUserContent = function(data) {
    DocumentTypesService.set(data.document_types);
    ProvidersService.set(data.provider_status);
  };

  // Login : Login the user using the basic method or the cookies credentials
  // return a promise methode
  datas.login = function(user) {
    var deferred = $q.defer();

    // Creation of the user credential
    var credentials;
    if (user) {
      credentials = btoa(user.email + ':' + user.password);
    } else {
      credentials = $cookies.credentials;
    }

    // Check the user credentials validity
    $http.defaults.headers.common.Authorization = 'Basic ' + credentials;
    $http({method: 'GET', url: 'http://api.anyfetch.com'})
      .success(function(data) {
        datas.currentUser = {
          email: data.name,
          id: data.id,
          credentials: credentials
        };

        $cookies.credentials = credentials;

        bootstrapUserContent(data);

        deferred.resolve(datas.currentUser);
      })
      .error(deferred.reject);

    return deferred.promise;
  };

  // Lougout : Lougout the current user
  datas.logout = function() {
    console.log('loggin out');
    datas.currentUser = null;
    $cookieStore.remove('credentials');
  };

  // isLoggedIn : check if a user is currently logged in
  // return a promise containing the user if it's resolved
  datas.isLoggedin = function() {
    var deferred = $q.defer();

    if (datas.currentUser) {
      deferred.resolve(datas.currentUser);
    } else if ($cookies.credentials) {
      datas.login()
        .then(function(user) {
          console.log('Login ', user);
          datas.currentUser = user;
          deferred.resolve(user);
        }, function() {
          $cookieStore.remove('credentials');
          deferred.reject();
        });
    } else {
      deferred.reject();
    }

    return  deferred.promise;
  };

  // Return of the service
  return datas;

});
'use strict';

angular.module('anyfetchFrontApp.services', [])
.factory( 'AuthService', function($cookies, $cookieStore, $rootScope, $http) {
	var currentUser;

	var login = function(user, success, error) {
		// Creation of the user credential
		var credentials = btoa(user.email + ':' + user.password);

		// Check the user credentials validity
		$http.defaults.headers.common.Authorization = 'Basic ' + credentials;
		$http({method: 'GET', url: 'http://api.anyfetch.com'})
			.success(function(data) {
				data.credentials = credentials;
				currentUser = data;
				success();
			})
			.error(error);
	};

	var logout = function(cb) {
		$cookieStore.remove('credentials');
		cb();
	};

	var isLoggedin = function() { return currentUser ? true : false; };

	return {
		login: login,
		logout: logout,
		isLoggedin : isLoggedin,
		currentUser: currentUser
	};
})
.factory( 'ProviderService', function($http, AuthService) {
	var connectedProviders;

	var setProviders = function(providers, cb) {
		connectedProviders = providers;
		cb();
	};

	var updateConnectedProviders = function(cb) {
		$http.defaults.headers.common.Authorization = 'Basic ' + AuthService.getUser().credentials;
		$http({method: 'GET', url: 'http://api.anyfetch.com/update'})
			.success(function(data, status) {
				if (status !== 204) {
					return cb(data);
				}
				cb(null);
			})
			.error(function(data) {
				cb(data);
			});
	};

	return {
		setProviders: setProviders,
		updateConnectedProviders: updateConnectedProviders
	};
});
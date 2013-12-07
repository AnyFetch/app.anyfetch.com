'use strict';

angular.module('anyfetchFrontApp.services', [])
.factory( 'AuthService', function($cookies, $cookieStore, $rootScope, $http) {
	var currentUser;

	var login = function(user, sucess, error) {
		console.log(user.email, user.password);

		$http.defaults.headers.common.Authorization = 'Basic ' + credentials;
		$http({method: 'GET', url: 'http://api.anyfetch.com'})
			.success(function(data, status) {
				if (status !== 200) {
					console.log('Error ', data);
				}
				data.credentials = credentials;
				currentUser = data;
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
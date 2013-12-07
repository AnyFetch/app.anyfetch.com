'use strict';

angular.module('anyfetchFrontApp.services', [])
.factory( 'AuthService', function($cookies, $cookieStore, $rootScope, $http) {
	var currentUser;

	var login = function(user, success, error) {
		console.log('try to login');
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
				data.credentials = credentials;
				currentUser = data;
				$cookies.credentials = credentials;
				success(currentUser);
			})
			.error(error);
	};

	var logout = function(cb) {
		$cookieStore.remove('credentials');
		cb();
	};

	var isLoggedin = function(success, error) {
		if (currentUser !== undefined ) {
			success();
		} else if ($cookies.credentials) {
			login(null, function() {
				success();
			},
			function() {
				$cookieStore.remove('credentials');
				error();
			});
		} else {
			error();
		}
	};

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
'use strict';

angular.module('anyfetchFrontApp.services', [])
.factory( 'AuthService', function($cookies, $cookieStore, $rootScope, $http, $q) {
	
	var datas = {
		currentUser: null
	};

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
				data.credentials = credentials;
				datas.currentUser = data;
				$cookies.credentials = credentials;
				deferred.resolve(datas.currentUser);
			})
			.error(deferred.reject);

		return deferred.promise;
	};

	datas.logout = function(cb) {
		console.log('loggin out');
		datas.currentUser = null;
		$cookieStore.remove('credentials');
		cb();
	};

	datas.isLoggedin = function() {
		var deferred = $q.defer();
		console.log('Is trying to logged in');

		if (datas.currentUser) {
			deferred.resolve(datas.currentUser);
		} else if ($cookies.credentials) {
			datas.login()
				.then(function(user) {
					console.log('Login ', user);
					if (user) {
						datas.currentUser = user;
						deferred.resolve(user);
					} else {
						$cookieStore.remove('credentials');
						deferred.resolve();
					}
				});
		} else {
			deferred.resolve();
		}

		return  deferred.promise;
	};

	return datas;
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
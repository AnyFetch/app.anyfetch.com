'use strict';

angular.module('anyfetchFrontApp.services', [])
.factory( 'AuthService', function($cookies, $cookieStore, $http) {
	var currentUser;

	var login = function() {
		var credentials = $cookies.credentials;
		if (!credentials) {
			document.location.href = '/login.html';
		}

		$http.defaults.headers.common.Authorization = 'Basic ' + credentials;
		$http({method: 'GET', url: 'http://api.anyfetch.com'})
			.success(function(data, status) {
				if (status !== 200) {
					console.log('Error ', data);
				}
				data.credentials = credentials;
				currentUser = data;
			})
			.error(function(data) {
				console.log('Error ', data);
			});
	};

	var logout = function(cb) {
		$cookieStore.remove('credentials');
		cb();
	};

	var isLoggedin = function() { return currentUser ? true : false; };

	var getUser = function() { return currentUser; };

	return {
		login: login,
		logout: logout,
		isLoggedin : isLoggedin,
		currentUser: getUser
	};
});
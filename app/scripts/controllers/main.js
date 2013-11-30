'use strict';

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http) {

		$scope.search = function () {
			// DEBUG
			$scope.userName = 'test@papiel.fr';
			$scope.userPass = 'arf';

			$scope.loading = true;

			var searchUrl = 'http://api.anyfetch.com/documents?search='+$scope.textSearch+'&limit=50';
			var basicAuthBase64 = btoa($scope.userName+':'+$scope.userPass);
			console.log(basicAuthBase64);

			$http.defaults.headers.common.Authorization = 'Basic ' + basicAuthBase64;
			$http({method: 'GET', url: searchUrl})
			.success(function(data, status, headers, config) {
				console.log(data, status, headers(), config);
				$scope.results = data.datas;

				$scope.loading = false;
			})
			.error(function(data) {
				console.log('Error ', data);
			});

		};
	});

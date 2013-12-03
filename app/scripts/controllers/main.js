'use strict';

// ------------------------------------------------------
// 					MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http) {

		// ----------------- Géneral functions -----------------

		$scope.apiCall = function(query, callback) {
			var searchUrl = 'http://api.anyfetch.com/'+query;
			var basicAuthBase64 = btoa($scope.userName+':'+$scope.userPass);

			$http.defaults.headers.common.Authorization = 'Basic ' + basicAuthBase64;
			$http({method: 'GET', url: searchUrl})
			.success(callback)
			.error(function(data) {
				console.log('Error ', data);
			});
		};

		$scope.search = function (query) {
			$scope.loading = true;

			$scope.apiCall(
				'documents?search='+query+'&limit=50',
				function(data, status, headers, config) {
					console.log(data, status, headers(), config);
					$scope.results = data.datas;

					$scope.loading = false;
				});
		};


		// ----------------- Main -----------------

		// DEBUG
		$scope.userName = 'test@papiel.fr';
		$scope.userPass = 'arf';

		$scope.apiCall(
			'',
			function(data) {
				console.log(data);

				$scope.docTypes = data.document_types;
				$scope.provStatus = data.provider_status;
				$scope.userName = data.name;
			});

		$scope.search('style');
	});

'use strict';

// ------------------------------------------------------
// 					MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http, $rootScope, $cookies) {

		// ----------------- Géneral functions -----------------

		$scope.apiCall = function(query, callback) {
			var searchUrl = 'http://api.anyfetch.com'+query;
			// var basicAuthBase64 = btoa($scope.userName+':'+$scope.userPass);

			$http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.credentials;
			$http({method: 'GET', url: searchUrl})
			.success(callback)
			.error(function(data) {
				console.log('Error ', data);
			});
		};

		$scope.search = function (query) {
			var apiQuery = '/documents?search='+query+'&limit=50';
			$scope.loading = true;
			$scope.apiCall(apiQuery, function(data) {
					$scope.results = data.datas;
					$scope.loading = false;

					console.log($scope.results);
				});
		};

		$scope.setFilterDocs = function(value) {
			for(var i = 0; i < Object.keys($scope.docTypes).length; i++) {
				$scope.filterType[Object.keys($scope.docTypes)[i]] = value;
			}
		};

		$scope.setFilterProv = function(value) {
			for(var j = 0; j < Object.keys($scope.provStatus).length; j++) {
				$scope.filterProv[Object.keys($scope.provStatus)[j]] = value;
			}
		};

		// ----------------- Main -----------------

		$rootScope.credentials = $cookies.credentials;
		if (!$rootScope.credentials) {
			document.location.href = '/login.html';
		}

		// Init
		$scope.Object = Object;
		$scope.filterType = {};
		$scope.filterProv = {};

		$scope.apiCall('/', function(data) {

			$scope.docTypes = data.document_types;
			$scope.setFilterDocs(true);

			$scope.provStatus = data.provider_status;
			$scope.setFilterProv(true);

			$scope.userName = data.name;

			console.log($scope.docTypes, $scope.provStatus);
			console.log($scope.filterType, $scope.filterProv);

			// DEBUG
			$scope.search('style');
		});
	});

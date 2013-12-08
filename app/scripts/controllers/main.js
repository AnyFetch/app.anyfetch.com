'use strict';

// ------------------------------------------------------
// 					MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http, $rootScope, $cookies, $location) {

		// ----------------- Géneral functions -----------------

		// !!! Do the $scope.loading management yourself !!!
		$scope.apiCall = function(query, callback) {
			var searchUrl = 'http://api.anyfetch.com'+query;

			$http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.credentials;
			$http({method: 'GET', url: searchUrl})
			.success(callback)
			.error(function(data) {
				console.log('Error ', data, query);
			});
		};

		$scope.search = function (query) {
			var apiQuery = '/documents?search='+query+'&limit=50';
			$scope.loading = true;
			$scope.apiCall(apiQuery, function(data) {
					$scope.results = data.datas;
					$scope.loading = false;
					$location.search('q', $scope.textSearch);
				});
		};

		$scope.setFilterDocs = function(value) {
			$scope.filterDocsFull = value;

			console.info("Filter Docs -> ", value)

			if (value) {
				for(var i = 0; i < Object.keys($scope.docTypes).length; i++) {
					$scope.filterType[Object.keys($scope.docTypes)[i]] = !value;
				}
			}
		};

		$scope.setFilterProv = function(value) {
			$scope.filterProvFull = value;

			if (value) {
				for(var j = 0; j < Object.keys($scope.provStatus).length; j++) {
					$scope.filterProv[Object.keys($scope.provStatus)[j]] = !value;
				}
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

		$scope.loading = true;
		$scope.apiCall('/', function(data) {

			$scope.docTypes = data.document_types;
			$scope.setFilterDocs(true);

			$scope.provStatus = data.provider_status;
			$scope.setFilterProv(true);

			$scope.userName = data.name;

			console.log($scope.docTypes, $scope.provStatus);
			console.log($scope.filterType, $scope.filterProv);
			console.log(Object.keys($scope.provStatus)[0]);
			console.log($scope.filterProv['529c457e03a470cfad000007']);

			$scope.loading = false;

			if ($location.search().q) {
				$scope.textSearch = $location.search().q;
				$scope.search($location.search().q);
			} else {
				//ZERO STATE
			}
		});
	});

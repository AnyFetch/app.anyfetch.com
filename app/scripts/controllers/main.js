'use strict';

// ------------------------------------------------------
// 					MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http, $rootScope, $cookies, $location) {

		// ----------------- Géneral functions -----------------

		$scope.apiCall = function(query, callback) {
			var searchUrl = 'http://api.anyfetch.com/'+query;

			$http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.credentials;
			$http({method: 'GET', url: searchUrl})
			.success(callback)
			.error(function(data) {
				console.log('Error ', data);
			});
		};

		$scope.search = function (query) {
			var apiQuery = 'documents?search='+query+'&limit=50';
			$scope.loading = true;
			$scope.apiCall(apiQuery, function(data) {
					$scope.results = data.datas;
					$scope.loading = false;
					$location.search('q', $scope.textSearch);
				});
		};

		$scope.mustacheTemplate = function(result) {
			var htmlTemplate = $scope.docTypes[result.document_type].template_snippet;
			var templatedResult = Mustache.render(htmlTemplate, result.datas);
			return templatedResult;
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

		$scope.apiCall('', function(data) {

			$scope.docTypes = data.document_types;
			for(var i = 0; i < Object.keys($scope.docTypes).length; i++) {
				$scope.filterType[Object.keys($scope.docTypes)[i]] = true;
			}

			$scope.provStatus = data.provider_status;
			for(var j = 0; j < Object.keys($scope.provStatus).length; j++) {
				$scope.filterProv[Object.keys($scope.provStatus)[j]] = true;
			}

			$scope.userName = data.name;

			console.log($scope.docTypes, $scope.provStatus);
			console.log($scope.filterType, $scope.filterProv);


			if ($location.search().q) {
				$scope.textSearch = $location.search().q;
				$scope.search($location.search().q);
			}
		});
	});

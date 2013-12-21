'use strict';


// ------------------------------------------------------
// 					MainCrtl
// ------------------------------------------------------

angular.module('anyfetchFrontApp')
	.controller('MainCtrl', function ($scope, $http, $rootScope, $cookies, $location) {

		// ----------------- API calls functions -----------------

		// !!! Do the $scope.loading management yourself !!!
		$scope.apiCall = function(query, callback) {
			//var searchUrl = 'http://api.anyfetch.com'+query;
			var searchUrl = 'offline'+query;
			$http.defaults.headers.common.Authorization = 'Basic ' + $rootScope.credentials;
			$http({method: 'GET', url: searchUrl})
			.success(callback)
			.error(function(data) {
				console.log('Error ', data, query);
			});
		};

		$scope.search = function (query) {
			var apiQuery = '/documents.json?search='+query+'&limit=50';
			$scope.loading = true;
			$scope.apiCall(apiQuery, function(data) {
					$scope.results = data.datas;
					$scope.nbResultsDocs = data.document_types;
					$scope.nbResultsProv = data.tokens;
					console.log($scope.nbResultsProv);
					$scope.loading = false;
					$location.search('q', $scope.textSearch);
				});
		};

		// ----------------- Filters functions -----------------

		$scope.resetFilterDocs = function() {
			$scope.filterNeutralDocs = true;

			for(var i = 0; i < Object.keys($scope.docTypes).length; i++) {
				$scope.filterType[Object.keys($scope.docTypes)[i]] = false;
			}
		};

		$scope.setFilterDocs = function() {
			$scope.filterNeutralDocs = false;
		};

		$scope.resetFilterProv = function() {
			$scope.filterNeutralProv = true;

			for(var j = 0; j < Object.keys($scope.provStatus).length; j++) {
				$scope.filterProv[Object.keys($scope.provStatus)[j]] = false;
			}
		};

		$scope.setFilterProv = function() {
			$scope.filterNeutralProv = false;
		};

		// ----------------- Main -----------------

		$scope.logout = function(){
			window.cookie.delete('credentials');
			document.location.href = '/login.html';
		};

		$rootScope.credentials = $cookies.credentials;
		if (!$rootScope.credentials) {
			document.location.href = '/login.html';
		}

		// Init
		$scope.Object = Object;
		$scope.filterType = {};
		$scope.filterProv = {};

		$scope.loading = true;
		$scope.apiCall('/api.json', function(data) {

			$scope.docTypes = data.document_types;
			$scope.resetFilterDocs();

			$scope.provStatus = data.provider_status;
			$scope.resetFilterProv();

			$scope.userName = data.name;

			$scope.loading = false;

			if ($location.search().q) {
				$scope.textSearch = $location.search().q;
				$scope.search($location.search().q);
			} else {
				//ZERO STATE
			}
			$(document).foundation();
		});
	});

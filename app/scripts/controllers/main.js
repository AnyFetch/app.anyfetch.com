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
			var apiQuery = 'documents?search='+query+'&limit=50';
			$scope.loading = true;
			$scope.apiCall(apiQuery, function(data) {
					$scope.results = data.datas.map($scope.mustacheTemplate);
					$scope.loading = false;

					console.log($scope.results);
				});
		};

		$scope.mustacheTemplate = function(result) {
			var htmlTemplate = $scope.docTypes[result.document_type].template_snippet;
			var templatedResult = Mustache.render(htmlTemplate, result.datas);
			return templatedResult;
		};

		// ----------------- Main -----------------

		// DEBUG
		$scope.userName = 'test@papiel.fr';
		$scope.userPass = 'arf';

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

			// DEBUG
			$scope.search('style');
		});
	});

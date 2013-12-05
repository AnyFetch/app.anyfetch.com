'use strict';

angular.module('anyfetchFrontApp')
  .service('mustacheTemplating', function mustacheTemplating($scope) {
		var templateSnippets = function(data, cb) {
			data.datas.map($scope.mustacheTemplate);
		};

 //    var htmlTemplate = $scope.docTypes[result.document_type].template_snippet;
	// var templatedResult = Mustache.render(htmlTemplate, result.datas);
	// return templatedResult;
  });

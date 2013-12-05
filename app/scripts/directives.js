'use strict';

//--------------------------------------------------------------
//                 Angular Directives
//--------------------------------------------------------------

angular.module('anyfetchFrontApp.filters', []).
	directive('snippet', function() {
		var mustacheTemplate = function(result, template) {
			return Mustache.render(template, result.datas);
		};

		return {
			restrict: 'E',
			scope: {
				result: '=',
				documenttypes: '=',
				providers: '='
			},
			templateUrl: 'views/template snippet.html',
			link : function(scope) {
				var htmlTemplate = scope.documenttypes[scope.result.document_type].template_snippet;
				scope.snippetText = mustacheTemplate(scope.result, htmlTemplate);
			}
		};
	});
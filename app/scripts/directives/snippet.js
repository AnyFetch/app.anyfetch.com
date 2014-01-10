'use strict';

angular.module('anyfetchFrontApp.snippetDirective', [])
.directive('snippet', function(DocumentTypesService) {

    var mustacheTemplate = function(result, template) {
      return Mustache.render(template, result.datas);
    };

    return {
      restrict: 'E',
      scope: {
        result: '=',
        click: '&'
      },

      templateUrl: 'views/template snippet.html',
      link : function(scope) {
        var htmlTemplate = DocumentTypesService.get()[scope.result.document_type].template_snippet;
        scope.snippetText = mustacheTemplate(scope.result, htmlTemplate);

        scope.snippetClick = function() {
          scope.click({id: scope.result.id});
        };
      }
    };
  });
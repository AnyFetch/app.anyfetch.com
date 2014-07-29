'use strict';

angular.module('anyfetchFrontApp.snippetDirective', [])
.directive('snippet', function(DocumentTypesService) {

    var mustacheTemplate = function(result, template) {
      return Mustache.render(template, result.data);
    };

    return {
      restrict: 'E',
      scope: {
        result: '=',
        providerid: '=',
        click: '&'
      },

      templateUrl: 'views/template snippet.html',
      link : function(scope) {
        var htmlTemplate = DocumentTypesService.get().list[scope.result.document_type.id].templates.snippet;
        scope.snippetText = mustacheTemplate(scope.result, htmlTemplate);

        scope.snippetClick = function() {
          scope.click({id: scope.result.id});
        };

        scope.getDocumentTypeIcon = function() {
          var docType = scope.result.document_type.id;

          // Special case for document files
          if(docType === '5252ce4ce4cfcd16f55cfa3c') {

            var path = scope.result.data.path;

            // Prez icon
            if(/\.(<[^\>]+>)?(ppt|pptx|odp)(<[^\>]+>)?/.exec(path)) {
              return docType + '-prez';
            }

            // Pdf icon
            if(/\.(<[^\>]+>)?pdf(<[^\>]+>)?/.exec(path)) {
              return docType + '-pdf';
            }

            // Tab icon
            if(/\.(<[^\>]+>)?(xls|xlsx|ods)(<[^\>]+>)?/.exec(path)) {
              return docType + '-tab';
            }

          }

          return docType;
        };
      }
    };
  });

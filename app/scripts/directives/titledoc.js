'use strict';

angular.module('anyfetchFrontApp.titledocDirective', [])
.directive('titledoc', function(DocumentTypesService) {

  return {
    restrict: 'E',
    scope: {
      document: '='
    },
    templateUrl: 'views/template title.html',
    replace: true,
    link: function(scope) {
      scope.$watch('document', function(newVal) {
        if (newVal) {
          var titleTemplate = DocumentTypesService.get().list[scope.document.document_type].template_title;
          scope.title = Mustache.render(titleTemplate, scope.document.datas);
        }
      });
    }
  };
});
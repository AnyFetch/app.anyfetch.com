'use strict';

angular.module('anyfetchFrontApp.modalDirective', [])
.directive('modal', function(DocumentTypesService, ProvidersService) {

  return {
    restrict: 'E',
    scope: {
      show: '=',
      documentfull: '='
    },
    templateUrl: 'views/template modal.html',
    replace: true,
    link: function(scope) {

      scope.hideModal = function() {
        scope.show = false;
      };

      scope.$watch('show', function(newVal) {
        if (newVal) {
          var htmlTemplate = DocumentTypesService.get()[scope.documentfull.document_type].template_full;
          scope.fullText = Mustache.render(htmlTemplate, scope.documentfull.datas);
          scope.provider = ProvidersService.providers[scope.documentfull.token];
        }
      });
    }
  };
});
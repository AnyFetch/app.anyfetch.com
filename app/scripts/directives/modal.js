'use strict';

angular.module('anyfetchFrontApp.modalDirective', [])
.directive('modal', function(DocumentTypesService, ProvidersService, $location) {

  return {
    restrict: 'E',
    scope: {
      show: '=',
      documentfull: '=',
      query: '='
    },
    templateUrl: 'views/template modal.html',
    replace: true,
    link: function(scope) {
      scope.hideModal = function() {
        scope.show = false;
      };

      scope.show_similar = function() {
        scope.hideModal();
        if (!$location.search().similar_to && $location.search().id) {
          var actualSearch = $location.search();
          actualSearch.similar_to = actualSearch.id;
          delete actualSearch.id;
          $location.search(actualSearch);
        }
      };

      scope.$watch('documentfull', function(newVal) {
        scope.fullText = null;

        if (newVal) {
          var htmlTemplate = DocumentTypesService.get()[scope.documentfull.document_type].template_full;
          scope.fullText = Mustache.render(htmlTemplate, scope.documentfull.datas);
          scope.provider = ProvidersService.providers[scope.documentfull.token];
        }
      });
    }
  };
});
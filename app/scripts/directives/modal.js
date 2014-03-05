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
      scope.relDefaultLabel = 'undefined';

      scope.resetScope = function () {
        scope.relatedShow = false;
        scope.relatedDatas = null;
        scope.fullText = null;
      };

      scope.displayFull = function(id) {
        var actualSearch = $location.search();
        actualSearch.id = id;
        console.log(actualSearch);
        $location.search(actualSearch);
      };

      scope.getDocumentTypeIcon = function(document) {
        var docType = document.document_type;
        if (docType === '5252ce4ce4cfcd16f55cfa3c') {

          var path = document.datas.path;

          // Prez icon
          if (/\.(<[^\>]+>)?(ppt|pptx|odp)(<[^\>]+>)?/.exec(path)) {
            return docType + '-prez';
          }

          // Pdf icon
          if (/\.(<[^\>]+>)?pdf(<[^\>]+>)?/.exec(path)) {
            return docType + '-pdf';
          }

          // Tab icon
          if (/\.(<[^\>]+>)?(xls|xlsx|ods)(<[^\>]+>)?/.exec(path)) {
            return docType + '-tab';
          }

        }

        return docType;
      };

      scope.hideModal = function() {
        scope.show = false;
        $('body').removeClass('lock');
      };

      scope.show_similar = function() {
        scope.hideModal();
        if ($location.search().id) {
          var actualSearch = $location.search();
          actualSearch.similar_to = actualSearch.id;
          delete actualSearch.id;
          $location.search(actualSearch);
        }
      };

      scope.relatedToggle = function() {
        scope.relatedShow = !scope.relatedShow;
      };

      scope.$watch('documentfull', function(newVal) {
        scope.resetScope();
        console.log(scope.documentfull);

        $(document).foundation();
        scope.query = scope.query || $location.search().q;
        if (newVal) {
          var htmlTemplate = DocumentTypesService.get().list[scope.documentfull.document_type].template_full;
          scope.fullText = Mustache.render(htmlTemplate, scope.documentfull.datas);
          scope.provider = ProvidersService.providers.list[scope.documentfull.token];
        }
      });
    }
  };
});
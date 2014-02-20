'use strict';

angular.module('anyfetchFrontApp.modalDirective', [])
.directive('modal', function(DocumentTypesService, ProvidersService, $location, $http) {

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
      console.log(DocumentTypesService.get());
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

        if (scope.relatedShow && !scope.relatedDatas) {
          scope.related();
        }
      };

      scope.related = function() {
        scope.relatedShow = true;

        scope.relatedLoading = true;

        // 52f97e21da04847b53ffe21a
        var apiQuery = 'http://api.anyfetch.com/documents/'+scope.documentfull.id+'/related';
        $http({method: 'GET', url: apiQuery})
          .success(function(data) {
            console.log('Result: ', data);
            scope.relatedLoading = false;
            if (data) {
              if (data.datas.length) {
                scope.relatedDatas = data;
              }
              else {
                //No related!
              }
            } else {
              //Nothing recieved!
            }
          })
          .error(function() {
            console.log('Error while loading full preview of the document '+scope.documentfull.id);
            // scope.display_error('Error while loading full preview of the document '+scope.id);
          });
      };

      scope.$watch('documentfull', function(newVal) {
        scope.resetScope();

        $(document).foundation();
        scope.query = scope.query || $location.search().q;
        if (newVal) {
          var htmlTemplate = DocumentTypesService.get().list[scope.documentfull.document_type].template_full;
          scope.fullText = Mustache.render(htmlTemplate, scope.documentfull.datas);
          scope.provider = ProvidersService.providers[scope.documentfull.token];
        }
      });
    }
  };
});
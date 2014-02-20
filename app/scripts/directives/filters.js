'use strict';

angular.module('anyfetchFrontApp.filtersDirective', [])
.directive('filters', function(DocumentTypesService, ProvidersService) {

  return {
    restrict: 'E',
    scope: {
      update: '=',
      times: '='
    },
    templateUrl: 'views/filters.html',
    replace: true,
    link: function(scope) {
      scope.providers = ProvidersService.get();
      scope.documentTypes = DocumentTypesService.get();
      scope.Object = Object;

      scope.resetDocTypes = function() {
        DocumentTypesService.reset(false);
        scope.update(scope.timeFilter);
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.update(scope.timeFilter);
      };

      scope.resetTime = function() {
        scope.timeFilter = '';
        // Forcing time filter update
        scope.update(scope.timeFilter, true);
      };

      scope.$watch('timeFilter', function(newVal) {
        if (newVal) {
          scope.update(scope.timeFilter);
        }
      });
    }
  };
});
'use strict';

angular.module('anyfetchFrontApp.filtersDirective', [])
.directive('filters', function(DocumentTypesService, ProvidersService, TimeService) {

  return {
    restrict: 'E',
    scope: {
      filterupdate: '='
    },
    templateUrl: 'views/filters.html',
    replace: true,
    link: function(scope) {
      scope.providers = ProvidersService.get();
      scope.documentTypes = DocumentTypesService.get();
      scope.times = TimeService.get();
      scope.Object = Object;

      scope.resetDocTypes = function() {
        DocumentTypesService.reset(false);
        scope.filterupdate = 1;
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.filterupdate = 1;
      };

      scope.resetTime = function() {
        scope.timeFilter = '';
        TimeService.reset(false);
        // Forcing time filter update
        scope.filterupdate = 1;
      };

      scope.$watch('times.after', function(newVal) {
        if (newVal) {
          scope.filterupdate = 1;
        }
      });

      scope.$watch('times.before', function(newVal) {
        if (newVal) {
          scope.filterupdate = 1;
        }
      });

      scope.$watch('documentTypes.states', function(newVal) {
        if (newVal) {
          scope.filterupdate = -1;
        }
      }, true);

      scope.$watch('providers.states', function(newVal) {
        if (newVal) {
          scope.filterupdate = -1;
        }
      }, true);
    }
  };
});
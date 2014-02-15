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
      // setInterval(function() { console.log('Get new'); scope.times = TimeService.get(); }, 1000);

      scope.resetDocTypes = function() {
        DocumentTypesService.reset(false);
        scope.update(scope.timeFilter);
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.update(scope.timeFilter);
      };

      scope.$watch('timeFilter', function(newVal) {
        if (newVal) {
          scope.update(scope.timeFilter);
        }
      });
    }
  };
});
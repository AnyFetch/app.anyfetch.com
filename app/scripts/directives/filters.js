'use strict';

angular.module('anyfetchFrontApp.filtersDirective', [])
.directive('filters', function(DocumentTypesService, ProvidersService, TimeService) {

  return {
    restrict: 'E',
    scope: {
      update: '='
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
        scope.update(scope.timeFilter, false);
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.update(scope.timeFilter, false);
      };

      scope.resetTime = function() {
        scope.timeFilter = '';
        TimeService.reset();
        // Forcing time filter update
        scope.update(scope.timeFilter, true);
      };

      scope.$watch('timeFilter', function(newVal) {
        if (newVal) {
          var after = new Date(parseInt(scope.timeFilter));
          var afterMonth = after.getMonth() + 1;
          if (afterMonth < 10) {
            afterMonth = '0'+afterMonth;
          }
          var afterDate = after.getDate();
          if (afterDate < 10) {
            afterDate = '0'+afterDate;
          }

          var before = new Date(parseInt(scope.timeFilter));
          var nbDaysThisMonth = new Date(before.getFullYear(), before.getMonth()+1, 0).getDate();
          before.setMonth(before.getMonth() + 2);
          before.setDate(nbDaysThisMonth);
          var beforeMonth = before.getMonth() + 1;
          if (beforeMonth < 10) {
            beforeMonth = '0'+beforeMonth;
          }
          var beforeDate = before.getDate();
          if (beforeDate < 10) {
            beforeDate = '0'+beforeDate;
          }

          scope.times.after = after.getFullYear()+'-'+afterMonth+'-'+afterDate;
          scope.times.before = before.getFullYear()+'-'+beforeMonth+'-'+beforeDate;

          scope.update();
        }
      });
    }
  };
});
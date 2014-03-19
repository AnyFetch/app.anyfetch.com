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
      scope.months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

      scope.getDate = function(i) {
        var actTime = scope.times.list[i];

        if (actTime) {
          var date = new Date(parseInt(actTime.timestamp));
          return scope.months[date.getMonth()] + ' ' + date.getFullYear();
        }
        
        return '?';
      };

      scope.getRange = function (aft, bef) {
        var afterTime = scope.times.list[aft];
        var beforeTime = scope.times.list[bef];

        if (afterTime && beforeTime) {
          var afterDate = new Date(parseInt(afterTime.timestamp));
          var beforeDate = new Date(parseInt(beforeTime.timestamp));

          return 'From ' + scope.months[afterDate.getMonth()] + ' ' + afterDate.getFullYear() + ' to ' + scope.months[beforeDate.getMonth()] + ' ' + beforeDate.getFullYear();
        }

        return '?';
      };

      scope.resetDocTypes = function() {
        DocumentTypesService.reset(false);
        scope.filterupdate = 1;
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.filterupdate = 1;
      };

      scope.resetTime = function() {
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
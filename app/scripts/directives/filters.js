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

      scope.init = {
        timesAfter: false,
        timesBefore: false,
        docState: false,
        provState: false,
      };

      scope.getDate = function(i) {
        var actTime = scope.times.list[i];

        if(actTime) {
          var date = new Date(actTime.timestamp);
          return scope.months[date.getMonth()] + ' ' + date.getFullYear();
        }

        return '?';
      };

      scope.getRange = function(aft, bef) {
        var afterTime = scope.times.list[aft];
        var beforeTime = scope.times.list[bef];

        if(afterTime && beforeTime) {
          var afterDate = new Date(afterTime.timestamp);
          var beforeDate = new Date(beforeTime.timestamp);

          return 'From ' + scope.months[afterDate.getMonth()] + ' ' + afterDate.getFullYear() + ' to ' + scope.months[beforeDate.getMonth()] + ' ' + beforeDate.getFullYear();
        }

        return '?';
      };

      scope.resetDocTypes = function() {
        DocumentTypesService.reset(false);
        scope.filterupdate = true;
      };

      scope.resetProv = function() {
        ProvidersService.reset(false);
        scope.filterupdate = true;
      };

      scope.resetTime = function() {
        console.log('trigger restTimes');
        TimeService.reset(false);
        // Forcing time filter update
        scope.filterupdate = true;
      };

      scope.updateTime = function() {
        // DEBUG
        console.log('updateTime : ', scope.timeChanged);
        if(scope.timeChanged) {
          scope.filterupdate = true;
          scope.timeChanged = false;
        }
      };

      scope.$watch('times.after', function(newVal) {
        if(newVal) {
          if(scope.init.timesAfter) {
            scope.timeChanged = true;
          } else {
            scope.init.timesAfter = true;
          }
        }
      });

      scope.$watch('times.before', function(newVal) {
        if(newVal) {
          if(scope.init.timesBefore) {
            scope.timeChanged = true;
          } else {
            scope.init.timesBefore = true;
          }
        }
      });

      scope.$watch('documentTypes.states', function(newVal) {
        if(newVal) {
          if(scope.init.docState) {
            scope.filterupdate = true;
          } else {
            scope.init.docState = true;
          }
        }
      }, true);

      scope.$watch('providers.states', function(newVal) {
        if(newVal) {
          if(scope.init.provState) {
            scope.filterupdate = true;
          } else {
            scope.init.provState = true;
          }
        }
      }, true);
    }
  };
});

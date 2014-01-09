'use strict';

angular.module('anyfetchFrontApp.modalDirective', [])
.directive('modal', function() {
  return {
    restrict: 'E',
    scope: {
      show: '='
    },
    templateUrl: 'views/template modal.html',
    replace: true,
    transclude: true,
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width) {
        scope.dialogStyle.width = attrs.width;
      }
      if (attrs.height) {
        scope.dialogStyle.height = attrs.height;
      }

      scope.hideModal = function() {
        scope.show = false;
      };
    }
  };
});
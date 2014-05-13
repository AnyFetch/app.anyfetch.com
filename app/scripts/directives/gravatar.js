'use strict';

angular.module('anyfetchFrontApp.gravatarDirective', [])
.directive('gravatar', function() {
    var getImageSrc = function(value, size, defaultUrl) {
      var hash = md5(value);
      var src = 'http://www.gravatar.com/avatar/' + hash + '?s=' + size + '&d=' + defaultUrl;
      return src;
    };

    return {
      restrict: 'EAC',
      link:function(scope, elm, attrs) {
        scope.$watch(attrs.gravatarEmail, function(value) {

          var size = attrs.gravatarSize || 30;
          var defaultUrl = attrs.gravatarDefault || 'mm';

          var src = getImageSrc(value, size, defaultUrl);
          var tag = '<img " src="' + src + '" >';

          elm.find('img').remove();
          elm.append(tag);
        });
      }
    };
  });

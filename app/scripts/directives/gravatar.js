angular.module('anyfetchFrontApp.directives', []).
  directive('gravatar', function() {
    var getImageSrc = function(value, size, defaultUrl) {
        var src = 'http://www.gravatar.com/avatar/' + value + '?s=' + size + '&d=' + defaultUrl;
        return src;
    }

    return {
      restrict: 'EAC',
      link:function (scope, elm, attrs) {
        scope.$watch(attrs.gravatarEmail, function (value) {

          var size = attrs.gravatarSize || 30;
          var defaultUrl = attrs.gravatarDefault || 'mm';

          var src = getImageSrc(value, size, defaultUrl);

          var tag = '<img " src="' + src + '" >';

          console.log(tag);

          elm.find('img').remove();
          elm.append(tag);
        });
      }
    };
  });
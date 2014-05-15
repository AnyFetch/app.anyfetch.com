'use strict';

angular.module('anyfetchFrontApp.providerDirective', [])
.directive('provider', function(ProvidersService, AuthService) {

  return {
    restrict: 'E',
    scope: {
      show: '=',
    },
    templateUrl: 'views/template provider.html',
    replace: true,
    link: function(scope) {

      scope.hideModal = function() {
        scope.unbindEchap();
        scope.show = false;
        $('body').removeClass('lock');
      };

      scope.unbindEchap = function() {
        $(document).keyup(null);
      };

      scope.bindEchap = function() {
        $(document).keyup(function(e){
          if (e.keyCode === 27) {
            scope.$apply(scope.hideModal);
          }
        });
      };

      scope.connect = function(providerId) {
        var creds = AuthService.currentUser.credentials;
        var url = 'http://settings.anyfetch.com/provider/connect?app_id=' + providerId + '&creds=' + creds + '&redirect_url=http://app.anyfetch.com';
        window.location = url;
      };

      scope.$watch('show', function(newVal) {
        if (!newVal) {
          return;
        }

        ProvidersService.getAvailableProviders()
          .then(function(providers) {
            scope.providers = providers;
          });
      });
    }
  };
});

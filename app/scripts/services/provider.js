'use strict';

anyfetchFrontApp.factory( 'ProvidersService', function() {
  
  var datas = {
    providers: null
  };

  datas.set = function(providers) {
    datas.providers = providers;
  };

  datas.get = function() {
    return datas.providers;
  };

  // Return of the service
  return datas;

});
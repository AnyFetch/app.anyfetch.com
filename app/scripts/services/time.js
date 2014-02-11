'use strict';

angular.module('anyfetchFrontApp.timeService', [])
.factory( 'TimeService', function() {

  var datas = {
    times: []
  };

  datas.set = function(times) {
    datas.times = [];
    angular.forEach(Object.keys(times), function(value){
      var date = new Date(parseInt(value));
      var time = {
        timestamp: value,
        count: times[value],
        label: 'From ' + date.getMonth() + ' to ' + (date.getMonth() + 3) + ' ' + date.getFullYear()
      };

      datas.times.push(time);
    });

    return datas.times;
  };

  datas.get = function() {
    return datas.times;
  };

  // Return of the service
  return datas;

});
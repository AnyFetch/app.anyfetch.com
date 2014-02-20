'use strict';

angular.module('anyfetchFrontApp.timeService', [])
.factory( 'TimeService', function() {

  var datas = {
    times: []
  };

  var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  datas.set = function(times) {
    datas.times = [];
    angular.forEach(Object.keys(times), function(value){
      var date = new Date(parseInt(value));
      var time = {
        timestamp: value,
        count: times[value],
        label: 'From ' + months[date.getMonth()] + ' to ' + months[(date.getMonth() + 2)] + ' ' + date.getFullYear()
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
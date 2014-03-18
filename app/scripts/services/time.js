'use strict';

angular.module('anyfetchFrontApp.timeService', [])
.factory( 'TimeService', function() {

  var datas = {
    times: {
      list: [],
      after: null,
      before: null
    }
  };

  var months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'June', 'July', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  datas.set = function(times) {
    datas.reset();
    angular.forEach(Object.keys(times), function(value){
      var date = new Date(parseInt(value));
      var time = {
        timestamp: value,
        count: times[value],
        label: 'From ' + months[date.getMonth()] + ' to ' + months[(date.getMonth() + 2)] + ' ' + date.getFullYear()
      };

      datas.times.list.push(time);
    });

    return datas.times;
  };

  datas.reset = function() {
    datas.times.list = [];
    datas.times.after = null;
    datas.times.before = null;
  };

  datas.get = function() {
    return datas.times;
  };

  // Return of the service
  return datas;

});
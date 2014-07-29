'use strict';

angular.module('anyfetchFrontApp.timeService', [])
.factory( 'TimeService', function() {

  var data = {
    times: {
      list: [],
      after: null,
      before: null
    }
  };

  data.set = function(times) {
    var timesHash = {};
    times.forEach(function(time) {
      timesHash[time.timestamp] = time.document_count;
    });

    data.reset(true);
    angular.forEach(Object.keys(timesHash), function(value) {
      var time = {
        timestamp: parseInt(value),
        count: timesHash[value]
      };

      data.times.list.push(time);
    });

    data.times.after = 0;
    data.times.before = data.times.list.length-1;

    return data.times;
  };

  data.reset = function(full) {
    if(full) {
      data.times.list = [];
      data.times.after = null;
      data.times.before = null;
    } else if(data.times.list.length) {
      data.times.after = 0;
      data.times.before = data.times.list.length-1;
    }
  };

  data.get = function() {
    return data.times;
  };

  data.getAfter = function() {
    if((data.times.after >= 0) && data.times.list.length) {
      var after = new Date(parseInt(data.times.list[data.times.after].timestamp));
      var afterMonth = after.getMonth() + 1;
      if(afterMonth < 10) {
        afterMonth = '0' + afterMonth;
      }
      var afterDate = after.getDate();
      if(afterDate < 10) {
        afterDate = '0' + afterDate;
      }

      return after.getFullYear() + '-' + afterMonth + '-' + afterDate;
    }
    else {
      return '';
    }
  };

  data.getBefore = function() {
    if((data.times.before >= 0) && data.times.list.length) {
      var before = new Date(parseInt(data.times.list[data.times.before].timestamp));
      var nbDaysThisMonth = new Date(before.getFullYear(), before.getMonth() + 1, 0).getDate();
      before.setMonth(before.getMonth() + 2);
      before.setDate(nbDaysThisMonth);
      var beforeMonth = before.getMonth() + 1;
      if(beforeMonth < 10) {
        beforeMonth = '0' + beforeMonth;
      }
      var beforeDate = before.getDate();
      if(beforeDate < 10) {
        beforeDate = '0' + beforeDate;
      }

      return before.getFullYear() + '-' + beforeMonth + '-' + beforeDate;
    }
    else {
      return '';
    }
  };

  // Return of the service
  return data;

});

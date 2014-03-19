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
    datas.reset(true);
    angular.forEach(Object.keys(times), function(value){
      var date = new Date(parseInt(value));
      var time = {
        timestamp: value,
        count: times[value],
        label: 'From ' + months[date.getMonth()] + ' to ' + months[(date.getMonth() + 2)] + ' ' + date.getFullYear()
      };

      datas.times.list.push(time);
    });

    datas.times.after = 0;
    datas.times.before = datas.times.list.length-1;

    return datas.times;
  };

  datas.reset = function(full) {
    if (full) {
      datas.times.list = [];
      datas.times.after = null;
      datas.times.before = null;
    } else if (datas.times.list.length) {
      datas.times.after = 0;
      datas.times.before = datas.times.list.length-1;
    }
  };

  datas.get = function() {
    return datas.times;
  };

  datas.getAfter = function() {
    if ((datas.times.after >= 0) && datas.times.list.length) {
      var after = new Date(parseInt(datas.times.list[datas.times.after].timestamp));
      var afterMonth = after.getMonth() + 1;
      if (afterMonth < 10) {
        afterMonth = '0'+afterMonth;
      }
      var afterDate = after.getDate();
      if (afterDate < 10) {
        afterDate = '0'+afterDate;
      }
      
      return after.getFullYear()+'-'+afterMonth+'-'+afterDate;
    }
    else {
      return '';
    }
  };

  datas.getBefore = function() {
    if ((datas.times.before >= 0) && datas.times.list.length) {
      var before = new Date(parseInt(datas.times.list[datas.times.before].timestamp));
      var nbDaysThisMonth = new Date(before.getFullYear(), before.getMonth()+1, 0).getDate();
      before.setMonth(before.getMonth() + 2);
      before.setDate(nbDaysThisMonth);
      var beforeMonth = before.getMonth() + 1;
      if (beforeMonth < 10) {
        beforeMonth = '0'+beforeMonth;
      }
      var beforeDate = before.getDate();
      if (beforeDate < 10) {
        beforeDate = '0'+beforeDate;
      }
      
      return before.getFullYear()+'-'+beforeMonth+'-'+beforeDate;
    }
    else {
      return '';
    }
  };

  // Return of the service
  return datas;

});
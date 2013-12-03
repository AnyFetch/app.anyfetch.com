'use strict';

/* Filters */

var dateFilter = function(date, plus) {
  date = new Date(date);

  if (date) {
    //Month in string
    var month;
    month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    var time = (plus) ? (' at ' + date.getHours() + ':' + date.getMinutes()) : '';
    return month + ', ' + date.getDate() + time;
  } else {
    return '';
  }
};

angular.module('anyfetchFrontApp.filters', []).
filter('niceDate', function() {
  return dateFilter;
});
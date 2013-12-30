'use strict';

/* Filters */

anyfetchFrontApp.filter('niceDate', function() {
  return function(date, plus) {
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
})
.filter('capitalizeFirst', function() {
  return function(string) {
    if (string) {
      string = string.charAt(0).toUpperCase() + string.slice(1);
    }

    return string;
  };
})
.filter('filtersResult', function() {
  return function(result, scope) {
    var selectedDoc = ( (scope.filterType[result.document_type] === true) || (scope.filterDocsFull === true) );
    var selectedProv = ( (scope.filterProv[result.token] === true) || (scope.filterProvFull === true) );
    
    return (selectedDoc || scope.filterNeutralDocs) && (selectedProv || scope.filterNeutralProv);
  };
});

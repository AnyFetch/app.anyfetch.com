'use strict';

/* Filters */

var dateFilter = function(date, plus) {
  date = new Date(date);

  if (date) {
    //Month in string
    var month;
    switch (date.getMonth() + 1) {
      case 1:
        month = 'January';
        break;
      case 2:
        month = 'February';
        break;
      case 3:
        month = 'March';
        break;
      case 4:
        month = 'April';
        break;
      case 5:
        month = 'May';
        break;
      case 6:
        month = 'June';
        break;
      case 7:
        month = 'July';
        break;
      case 8:
        month = 'August';
        break;
      case 9:
        month = 'September';
        break;
      case 10:
        month = 'October';
        break;
      case 11:
        month = 'November';
        break;
      case 12:
        month = 'December';
        break;
    }
    var time = (plus) ? (' at ' + date.getHours() + ':' + date.getMinutes()) : '';
    return month + ', ' + date.getDate() + time;
  } else {
    return '';
  }
};

angular.module('anyfetchFrontApp.filters', []).
filter('niceDate', function() {
  return dateFilter;
}).
filter('infoItem', function() {
  return function(item, infoNeeded) {
    //Regex
    var regexProv = /https?\:\/\/.{0,4}\.?(.*)\.\D{1,4}\/.*$/;
    var regexEver = /(evernote)/;
    var regexDocs = /https?\:\/\/.{0,4}\.?(.*)\.\D{1,4}\/.*\.(\D*)$/;

    //Get the docType
    var docType = item.document_type;

    switch (docType) {
      //--------------------------------------------
      //              Contact
      case '5252ce4ce4cfcd16f55cfa3a':
        switch (infoNeeded) {
          case 'provider':
            return 'salesforce';
          case 'type':
            return 'contact';
          case 'title':
            return item.datas.name;
          case 'snippet':
            return item.datas.job;
        }
        break;

        //--------------------------------------------
        //              Task
      case '5252ce4ce4cfcd16f55cfa41':
        switch (infoNeeded) {
          case 'provider':
            return 'salesforce';
          case 'type':
            if (item.datas.status.toLowerCase() === 'completed') {
              return 'task_ok';
            } else {
              return 'task_ko';
            }
            break;
          case 'title':
            return item.datas.subject;
          case 'snippet':
            return 'Status: ' + item.datas.status;
        }
        break;

        //--------------------------------------------
        //              Event
      case '5252ce4ce4cfcd16f55cfa40':
        switch (infoNeeded) {
          case 'provider':
            return 'salesforce';
          case 'type':
            return 'event';
          case 'title':
            return item.datas.name;
          case 'snippet':
            var dateStart = new Date(item.datas.startDate);
            var dateEnd = new Date(item.datas.endDate);

            return '<strong>Start: </strong>' + dateFilter(dateStart, true) + '<br /><strong>End: </strong>' + dateFilter(dateEnd, true);
            // return 'Start: '+dateStart+'; End: '+dateEnd;
        }
        break;

        //--------------------------------------------
        //              Campain
      case '5252ce4ce4cfcd16f55cfa43':
        switch (infoNeeded) {
          case 'provider':
            return 'exacttarget';
          case 'type':
            if (item.datas.status.toLowerCase() === 'open') {
              return 'mail_open';
            } else if (item.datas.status.toLowerCase() === 'delivred') {
              return 'mail_delivred';
            } else if (item.datas.status.toLowerCase() === 'sent') {
              return 'mail_sent';
            } else {
              return 'mail';
            }
            break;
          case 'title':
            return '[' + item.datas.status + '] ' + item.datas.campaign_name;
          case 'snippet':
            return item.datas.subject;
        }
        break;

        //--------------------------------------------
        //              Image
      case '5252ce4ce4cfcd16f55cfa3d':
        switch (infoNeeded) {
          case 'provider':
            var infosProv = regexProv.exec(item.actions.show);

            return (infosProv) ? infosProv[1].toLowerCase() : 'doc';
          case 'type':
            return 'img';
          case 'title':
            return item.datas.title;
          case 'snippet':
            return item.datas.snippet;
        }
        break;

        //--------------------------------------------
        //              File
      case '5252ce4ce4cfcd16f55cfa3b':
        switch (infoNeeded) {
          case 'provider':
            //Evernote
            infosProv = regexEver.exec(item.actions.show);
            if (!infosProv) {
              infosProv = regexProv.exec(item.actions.show);
            }

            return (infosProv) ? infosProv[1].toLowerCase() : 'salesfetch';
          case 'type':
            return 'file';
          case 'title':
            return item.datas.title;
          case 'snippet':
            return item.datas.snippet;
        }
        break;

        //--------------------------------------------
        //              Document
      case '5252ce4ce4cfcd16f55cfa3c':
        switch (infoNeeded) {
          case 'provider':
            //Evernote
            infosProv = regexEver.exec(item.actions.show);
            if (!infosProv) {
              infosProv = regexProv.exec(item.actions.show);
            }

            return (infosProv) ? infosProv[1].toLowerCase() : 'doc';
          case 'type':
            var infosDocs = regexDocs.exec(item.actions.show);

            if (infosDocs) {
              switch (infosDocs[2].toLowerCase()) {
                case 'pptx':
                  return 'ppt';
                case 'docx':
                case 'pdf':
                  return 'doc';
                case 'xlsx':
                  return 'xls';
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'gif':
                  return 'img';
                default:
                  return infosDocs[2].toLowerCase();
              }
            } else {
              return 'note';
            }
            break;
          case 'title':
            return item.datas.title;
          case 'snippet':
            return item.datas.snippet;
        }
        break;
      default:
        console.log('ERREUR: Doctype unknown', docType);
    }
  };
});
'use strict';

angular.module('anyfetchFrontApp.modalDirective', [])
.directive('modal', function(DocumentTypesService, ProvidersService, HighlightService, $location) {

  return {
    restrict: 'E',
    scope: {
      show: '=',
      documentfull: '=',
      query: '='
    },
    templateUrl: 'views/template modal.html',
    replace: true,
    link: function(scope) {
      scope.relDefaultLabel = 'undefined';
      scope.zoom = 100;
      scope.zoomClass = null;
      scope.showHighlighter = false;

      scope.resetScope = function() {
        scope.relatedShow = false;
        scope.relatedData = null;
        scope.fullText = null;
        scope.highlight_position = '';
      };

      scope.displayFull = function(id) {
        var actualSearch = $location.search();
        actualSearch.id = id;
        $location.search(actualSearch);
      };

      scope.zoomIn = function() {
        if(scope.zoom < 200) {
          scope.zoom += 10;

          if(scope.zoom === 100) {
            scope.zoomClass = null;
          } else {
            scope.zoomClass = 'zoom-' + scope.zoom;
          }
        }
      };

      scope.zoomOut = function() {
        if(scope.zoom > 50) {
          scope.zoom -= 10;

          if(scope.zoom === 100) {
            scope.zoomClass = null;
          } else {
            scope.zoomClass = 'zoom-' + scope.zoom;
          }
        }
      };

      scope.highlightNext = function() {
        HighlightService.next();
        scope.highlight_position = HighlightService.getTextPosition();
      };

      scope.highlightPrevious = function() {
        HighlightService.previous();
        scope.highlight_position = HighlightService.getTextPosition();
      };

      scope.getDocumentTypeIcon = function(document) {
        var docType = document.document_type.id;
        if(docType === '5252ce4ce4cfcd16f55cfa3c') {

          var path = document.data.path;

          // Prez icon
          if(/\.(<[^\>]+>)?(ppt|pptx|odp)(<[^\>]+>)?/.exec(path)) {
            return docType + '-prez';
          }

          // Pdf icon
          if(/\.(<[^\>]+>)?pdf(<[^\>]+>)?/.exec(path)) {
            return docType + '-pdf';
          }

          // Tab icon
          if(/\.(<[^\>]+>)?(xls|xlsx|ods)(<[^\>]+>)?/.exec(path)) {
            return docType + '-tab';
          }

        }

        return docType;
      };

      scope.unbindEchap = function() {
        $(document).keyup(null);
      };

      scope.bindEchap = function() {
        $(document).keyup(function(e) {
          if(e.keyCode === 27) {
            scope.$apply(scope.hideModal);
          }
        });
      };

      scope.hideModal = function() {
        scope.unbindEchap();
        scope.show = false;
        scope.zoom = 0;
        $('body').removeClass('lock');
      };

      scope.show_similar = function() {
        if($location.search().id) {
          var actualSearch = $location.search();
          actualSearch.similar_to = actualSearch.id;
          delete actualSearch.id;
          $location.search(actualSearch);
        }
        scope.hideModal();
      };

      scope.getTitleProjection = function(rel) {
        var htmlTemplate = DocumentTypesService.get().list[rel.document_type.id].templates.title;
        return Mustache.render(htmlTemplate, rel.data);
      };

      scope.relatedToggle = function() {
        scope.relatedShow = !scope.relatedShow;
      };

      scope.$watch('documentfull', function(newVal) {
        scope.resetScope();

        $(document).foundation();
        scope.query = scope.query || $location.search().q;
        if(newVal) {
          var htmlTemplate = DocumentTypesService.get().list[scope.documentfull.document_type.id].templates.full;
          scope.fullText = Mustache.render(htmlTemplate, scope.documentfull.data);
          scope.provider = ProvidersService.providers.list[scope.documentfull.provider.id];

          var iframe = ($('#iframe')[0].contentWindow || $('#iframe')[0].contentDocument);
          iframe.document.body.innerHTML = '<div class="wrapper">' + scope.fullText + '</div>';
          iframe.document.head.innerHTML = '<style>.wrapper{padding:2%}.hlt{background:rgba(255,242,138,.6)}.hlt_active{background:rgba(255,181,96,.6)}body{word-wrap:break-word}article.anyfetch-document-snippet{margin:0;padding:.5em}article.anyfetch-document-snippet *{margin:.2em;padding:0}article.anyfetch-document-snippet main.anyfetch-content{font-weight:lighter}article.anyfetch-document-snippet h1.anyfetch-title{font-size:1em;font-weight:700}article.anyfetch-document-full header.anyfetch-header{background-color:#fbfbfb;border-bottom:solid 1px gray;border-top:solid 1px gray;padding:.5em}article.anyfetch-document-full main.anyfetch-content{padding:.5em}article.anyfetch-document-full article.anyfetch-thread-part{margin:-.5em}header.anyfetch-header:after,header.anyfetch-header:before{content:"";display:table}header.anyfetch-header:after{clear:both}header.anyfetch-header{zoom:1}h1.anyfetch-title .anyfetch-number{display:inline-block;padding-left:.5em;padding-right:.5em;border-radius:1em;color:#fff;background-color:#000}.anyfetch-title-detail{color:grey}figure.anyfetch-aside-image{height:4em;float:left}figure.anyfetch-aside-image img{height:100%}ul.anyfetch-pill-list{margin:0;padding:0}ul.anyfetch-pill-list li{display:inline-block;list-style:none}li.anyfetch-pill{font-size:.75em;padding:.2em .5em;margin:0;border-radius:1em;color:gray;border:1px solid #a9a9a9}span.anyfetch-hlt{background-color:#ffffe0}.anyfetch-right-arrow{display:inline}.anyfetch-right-arrow:before{color:#000;content:"→"}.anyfetch-email:before{content:"<"}.anyfetch-email:after{content:">"}.anyfetch-date{font-style:italic}</style>';

          scope.bindEchap();

          HighlightService.reset();
          if(HighlightService.getMaxIndex() > 0) {
            scope.showHighlighter = true;
            scope.highlight_position = HighlightService.getTextOccurences();
          }

        }
      });
    }
  };
});

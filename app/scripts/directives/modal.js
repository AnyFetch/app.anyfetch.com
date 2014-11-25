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
          var style = document.createElement('style');
          style.innerHTML = '';
          // TODO: anyfetch-assets/dist/style.min.css version v2.0.3, find a better way to do this.
          style.innerHTML = '@charset "utf-8";.anyfetch-icon-people{display:inline-block;width:1em;height:1em;background-image:url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGcgZmlsbD0iI2I2YjZiNiI+PHBhdGggZD0iTTQ2Ljg2NCAxNy43N2MwIDguMjEyLTYuNjU4IDE0Ljg3LTE0Ljg3IDE0Ljg3cy0xNC44Ny02LjY1OC0xNC44Ny0xNC44N1MyMy43ODMgMi45IDMxLjk5NSAyLjlzMTQuODcgNi42NTggMTQuODcgMTQuODd6Ii8+PHBhdGggZD0iTTMyIDM5LjU2M2MtMTcuMTM3IDAtMzEuMTQyIDkuNTMtMzIgMjEuNTM3aDY0Yy0uODU4LTEyLjAwNy0xNC44NjMtMjEuNTM3LTMyLTIxLjUzN3oiLz48L2c+PC9zdmc+);background-repeat:no-repeat;background-position:bottom;background-size:.8em;margin-right:.5em;margin-left:-.2em}.anyfetch-icon-related{padding-left:9px;background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAKCAYAAABmBXS+AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gkWEAQrSHQi+QAAAJ9JREFUGNNt0LEKgXEUxuEHszIYbFaXwKYMRgwG1yDFVZDIDVDKogyfUVFyBWY2N0AZDVj+6uvLqVPnnH6d97yH/9FChCWyqT/AADlscMExnQAa+CCPZ5i940Ada+xRRBpbFH6bKiGhjxuO2GEIpaA/QjmAE1Qx/8lMsUAt9Ds0cYjfEuEa6jE6WCUtz9DDI/znlAQyOKONe3DUxSsOfQEQAh3RFNkN8wAAAABJRU5ErkJggg==) no-repeat;padding-bottom:10px}.anyfetch-document-full header.anyfetch-header{background-color:#fbfbfb;border-bottom:solid 1px #d3d3d3;padding:.5em;overflow:auto}.anyfetch-document-full header.anyfetch-header .anyfetch-title-group h1.anyfetch-title{font-size:1.4em;color:#444;margin-top:0;margin-bottom:.4em}.anyfetch-document-full header.anyfetch-header .anyfetch-title-group p.anyfetch-title-detail{margin-top:.4em;margin-bottom:.4em}.anyfetch-document-full main.anyfetch-content{overflow:auto;padding:.7em}.anyfetch-document-full main.anyfetch-content .anyfetch-section-title{margin-bottom:.8em}.anyfetch-document-full main.anyfetch-content p,.anyfetch-document-full main.anyfetch-content ul{margin-top:.8em}.anyfetch-document-full article.anyfetch-thread-part{margin:-.5em}header.anyfetch-header{overflow:hidden;zoom:1}header.anyfetch-header:after,header.anyfetch-header:before{content:"";display:table}header.anyfetch-header h1.anyfetch-title .anyfetch-number{display:inline-block;padding:0 .4em;border-radius:1em;min-width:1em;text-align:center;color:#646464;border:.1em solid #646464;font-size:.8em;line-height:1.2em;margin-right:.5em}header.anyfetch-header .anyfetch-title-detail{color:gray}ul.anyfetch-list-no-bullet{padding-left:1em}ul.anyfetch-list-no-bullet li{margin-bottom:.2em}ul.anyfetch-list{padding-left:3em}ul.anyfetch-list-no-bullet{list-style:none}ul.anyfetch-inline-list,ul.anyfetch-pill-list{display:inline-block;white-space:nowrap;overflow-x:hidden;width:100%;margin:0;padding:.1em 0}ul.anyfetch-pill-list{position:relative}ul.anyfetch-pill-list:after{content:" ";display:block;position:absolute;width:2em;top:0;right:0;bottom:0;mask-image:linear-gradient(to left,#fff 0,rgba(255,255,255,0) 100%);-webkit-mask-image:linear-gradient(to left,#fff 0,rgba(255,255,255,0) 100%);background-color:#fff;z-index:1}ul.anyfetch-inline-list li,ul.anyfetch-pill-list li{display:inline-block;list-style:none}.anyfetch-mobile-scroll ul.anyfetch-inline-list,.anyfetch-mobile-scroll ul.anyfetch-pill-list{overflow-x:auto;overflow-y:hidden;padding-right:5%;width:95%}ul.anyfetch-comma-list{display:inline-block;list-style:none}ul.anyfetch-comma-list li+li:before{content:", "}.anyfetch-pill{font-size:.75em;padding:.1em .5em;margin:0;border-radius:1em;color:gray;border:.1em solid #a9a9a9}ul.anyfetch-check-list{list-style:none;padding:0 0 0 1em}ul.anyfetch-check-list li{padding:0;list-style-type:none}h3.anyfetch-title-list{font-size:1.1em}ul.anyfetch-comment-list li{margin-top:.4em;margin-bottom:.4em}span.anyfetch-comment-author{font-size:.75em;padding:.2em .5em;margin:0;border-radius:1em;color:gray;border:1px solid #a9a9a9}.anyfetch-document-snippet{margin:0;padding:.5em;overflow:hidden;zoom:1}.anyfetch-document-snippet main.anyfetch-content{font-weight:lighter}.anyfetch-document-snippet h1.anyfetch-title{font-size:1em;font-weight:700;text-overflow:ellipsis;overflow:hidden;width:100%;white-space:nowrap;max-height:1.5em;margin:0}.anyfetch-document-snippet figure,.anyfetch-document-snippet p,.anyfetch-document-snippet>*{margin:0;padding:0}figure.anyfetch-aside-image{height:4em;float:left;margin:0 1em 0 0}figure.anyfetch-aside-image img{height:100%}hgroup.anyfetch-title-group{overflow:hidden}li.anyfetch-hlt,span.anyfetch-hlt{background-color:#ffffe0}.anyfetch-right-arrow{display:inline}.anyfetch-right-arrow:before{color:gray;content:"→"}.anyfetch-email:before{content:"<"}.anyfetch-email:after{content:">"}.anyfetch-date{font-style:italic}article.anyfetch-document-snippet.anyfetch-type-contact h1.anyfetch-title,article.anyfetch-document-snippet.anyfetch-type-image h1.anyfetch-title{width:auto}';
          iframe.document.head.appendChild(style);
          style = document.createElement('style');
          style.innerHTML = 'body {font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; margin: 0;}';
          iframe.document.head.appendChild(style);

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

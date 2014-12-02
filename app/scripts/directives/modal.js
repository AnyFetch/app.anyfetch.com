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
          // TODO: anyfetch-assets/dist/index.min.css version v2.1.4, find a better way to do this.
          // Caution to signle quotes in inline CSS and escaping destined to the CSS interpretor that will be interpreted by JS
          style.innerHTML = '@charset "utf-8";@font-face{font-family:anyfetch-font-icon;src:url(data:application/octet-stream;base64,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) format("woff"),url(data:application/octet-stream;base64,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sEsssgABQSstsEwssgEAQSstsE0ssgEBQSstsE4ssgAAQistsE8ssgABQistsFAssgEAQistsFEssgEBQistsFIssgAAPistsFMssgABPistsFQssgEAPistsFUssgEBPistsFYssgAAQCstsFcssgABQCstsFgssgEAQCstsFkssgEBQCstsFossgAAQystsFsssgABQystsFwssgEAQystsF0ssgEBQystsF4ssgAAPystsF8ssgABPystsGAssgEAPystsGEssgEBPystsGIssDcrLrErARQrLbBjLLA3K7A7Ky2wZCywNyuwPCstsGUssAAWsDcrsD0rLbBmLLA4Ky6xKwEUKy2wZyywOCuwOystsGgssDgrsDwrLbBpLLA4K7A9Ky2waiywOSsusSsBFCstsGsssDkrsDsrLbBsLLA5K7A8Ky2wbSywOSuwPSstsG4ssDorLrErARQrLbBvLLA6K7A7Ky2wcCywOiuwPCstsHEssDorsD0rLbByLLMJBAIDRVghGyMhWUIrsAhlsAMkUHiwARUwLQBLuADIUlixAQGOWbABuQgACABjcLEABUKxAAAqsQAFQrEACCqxAAVCsQAIKrEABUK5AAAACSqxAAVCuQAAAAkqsQMARLEkAYhRWLBAiFixA2REsSYBiFFYugiAAAEEQIhjVFixAwBEWVlZWbEADCq4Af+FsASNsQIARAA=) format("truetype")}[class*=anyfetch-icon-]:before,[class^=anyfetch-icon-]:before{font-family:anyfetch-font-icon;font-style:normal;font-weight:400;font-size:.9em;speak:none;display:inline-block;text-decoration:inherit;width:1em;margin-right:.4em;text-align:center;font-variant:normal;text-transform:none;line-height:1em;margin-left:.2em}.anyfetch-icon-attachment:before{content:"\\e800"}.anyfetch-icon-people:before{content:"\\e801"}.anyfetch-document-full header.anyfetch-header{background-color:#fbfbfb;border-bottom:solid 1px #d3d3d3;padding:.5em;overflow:auto}.anyfetch-document-full header.anyfetch-header .anyfetch-title-group h1.anyfetch-title{font-size:1.4em;color:#444;margin-top:0;margin-bottom:.4em}.anyfetch-document-full header.anyfetch-header .anyfetch-title-group p.anyfetch-title-detail{margin-top:.4em;margin-bottom:.4em}.anyfetch-document-full main.anyfetch-content{overflow:auto;padding:.7em}.anyfetch-document-full main.anyfetch-content .anyfetch-section-title{margin-bottom:.8em}.anyfetch-document-full main.anyfetch-content p,.anyfetch-document-full main.anyfetch-content ul{margin-top:.8em}.anyfetch-document-full article.anyfetch-thread-part{margin:-.5em}header.anyfetch-header{overflow:hidden;zoom:1}header.anyfetch-header:after,header.anyfetch-header:before{content:"";display:table}header.anyfetch-header h1.anyfetch-title .anyfetch-number{display:inline-block;padding:0 .4em;border-radius:1em;min-width:1em;text-align:center;color:#646464;border:1px solid #646464;font-size:.8em;line-height:1.2em;margin-right:.5em}header.anyfetch-header .anyfetch-title-detail{color:gray}ul.anyfetch-list-no-bullet{padding-left:1em}ul.anyfetch-list-no-bullet li{margin-bottom:.2em}ul.anyfetch-list{padding-left:3em}ul.anyfetch-list-no-bullet{list-style:none}ul.anyfetch-inline-list,ul.anyfetch-pill-list{white-space:nowrap;overflow-x:hidden;width:100%;margin:0;padding:.1em 0}ul.anyfetch-pill-list{position:relative}ul.anyfetch-pill-list:after{content:" ";display:block;position:absolute;width:2em;top:0;right:0;bottom:0;mask-image:linear-gradient(to left,#fff 0,rgba(255,255,255,0) 100%);-webkit-mask-image:linear-gradient(to left,#fff 0,rgba(255,255,255,0) 100%);background-color:#fff;z-index:1}ul.anyfetch-inline-list li,ul.anyfetch-pill-list li{display:inline-block;list-style:none}.anyfetch-mobile-scroll ul.anyfetch-inline-list,.anyfetch-mobile-scroll ul.anyfetch-pill-list{overflow-x:auto;overflow-y:hidden;padding-right:5%;width:95%}ul.anyfetch-comma-list{display:inline-block;list-style:none}ul.anyfetch-comma-list li+li:before{content:", "}.anyfetch-pill{font-size:.75em;padding:.1em .5em;margin:0;border-radius:1em;color:gray;border:1px solid #a9a9a9}ul.anyfetch-check-list{list-style:none;padding:0 0 0 1em}ul.anyfetch-check-list li{padding:0;list-style-type:none}h3.anyfetch-title-list{font-size:1.1em}ul.anyfetch-comment-list li{margin-top:.4em;margin-bottom:.4em}span.anyfetch-comment-author{font-size:.75em;padding:.2em .5em;margin:0;border-radius:1em;color:gray;border:1px solid #a9a9a9}.anyfetch-document-snippet{margin:0;padding:.5em;overflow:hidden;zoom:1}.anyfetch-document-snippet main.anyfetch-content{font-weight:lighter}.anyfetch-document-snippet h1.anyfetch-title{font-size:1em;font-weight:700;text-overflow:ellipsis;overflow:hidden;width:100%;white-space:nowrap;max-height:1.5em;margin:0}.anyfetch-document-snippet figure,.anyfetch-document-snippet p,.anyfetch-document-snippet>*{margin:0;padding:0}figure.anyfetch-aside-image{height:4em;float:left;margin:0 1em 0 0}figure.anyfetch-aside-image img{height:100%}hgroup.anyfetch-title-group{overflow:hidden}li.anyfetch-hlt,span.anyfetch-hlt{background-color:#ffffe0}.anyfetch-right-arrow{display:inline}.anyfetch-right-arrow:before{color:gray;content:"→"}.anyfetch-email:before{content:"<"}.anyfetch-email:after{content:">"}.anyfetch-date{font-style:italic}article.anyfetch-document-snippet.anyfetch-type-contact h1.anyfetch-title,article.anyfetch-document-snippet.anyfetch-type-image h1.anyfetch-title{width:auto}';
          style.innerHTML += ' body {font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; margin: 0;}';
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

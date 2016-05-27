(function (angular) {

	// Create all modules and define dependencies to make sure they exist
	// and are loaded in the correct order to satisfy dependency injection
	// before all nested files are concatenated by Gulp

	// Modules
	angular.module('angularHorizonsPublicView.directives',
		[]);
	angular.module('angularHorizonsPublicView.filters',
		[
			'rt.iso8601'
		]);
	angular.module('angularHorizonsPublicView.faveeoApi',
		[
			'restangular'
		]);
	angular.module('angularHorizonsPublicView.factories',
		[]);
	angular.module("angularHorizonsPublicView.simpleView",
		[
		]);

	angular.module('angularHorizonsPublicView',
		[
			'angularHorizonsPublicView.directives',
			'angularHorizonsPublicView.filters',
			'angularHorizonsPublicView.faveeoApi',
			'angularHorizonsPublicView.factories',
			'angularHorizonsPublicView.simpleView'
		]);

})(angular);

(function (app) {
    app.filter('default', function () {
        return function (value, defaultValue) {
            if (!value || value === "") {
                return defaultValue;
            }
            return value;
        };
    });

    app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) {
                return '';
            }
            max = parseInt(max, 10);
            if (!max) {
                return value;
            }
            if (value.length <= max) {
                return value;
            }
            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                }
            }
            return value + (tail || ' …');
        };
    });

    app.filter('twitterBigger', function () {
        return function (url) {
            return url.replace("_normal", "_bigger");
        };
    });

    app.filter('twitterFull', function () {
        return function (url) {
            return url.replace("_normal", "").replace("_bigger", "");
        };
    });

    app.filter('cleanHostName', function () {
        return function (source) {
            source = source.replace(/^https?:\/\//, '');
            if (source.substr(-1) == '/') {
                source = source.substr(0, source.length - 1);
            }
            return (source);
        };
    });

    app.filter('timeSince', function (iso8601) {

        return function (date) {
            if (typeof date !== 'object') {
                if (typeof date == 'string') {
                    date = iso8601.parse(date);
                } else {
                    date = new Date(date);
                }
            }

            var seconds = Math.floor((new Date() - date) / 1000);
            var intervalType;

            var interval = Math.floor(seconds / 31536000);
            if (interval >= 1) {
                intervalType = 'year';
            } else {
                interval = Math.floor(seconds / 2592000);
                if (interval >= 1) {
                    intervalType = 'month';
                } else {
                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1) {
                        intervalType = 'day';
                    } else {
                        interval = Math.floor(seconds / 3600);
                        if (interval >= 1) {
                            intervalType = "hour";
                        } else {
                            interval = Math.floor(seconds / 60);
                            if (interval >= 1) {
                                intervalType = "minute";
                            } else {
                                interval = seconds;
                                intervalType = "second";
                            }
                        }
                    }
                }
            }

            if (interval > 1 || interval === 0) {
                intervalType += 's';
            }

            return interval + ' ' + intervalType;
        };
    });

    app.filter('nl2br', function ($sce) {
        return function (msg, is_xhtml) {
            is_xhtml = is_xhtml || true;
            var breakTag = (is_xhtml) ? '<br />' : '<br>';
            msg = (msg + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
            return $sce.trustAsHtml(msg);
        };
    });

    app.filter('numberFormat', function () {
        return function (number) {
            if (number > 0) {
                var abs = Math.abs(number);
                if (abs >= Math.pow(10, 12)) {
                    number = (number / Math.pow(10, 12)).toFixed(1) + "t";
                }
                else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9)) {
                    number = (number / Math.pow(10, 9)).toFixed(1) + "b";
                }
                else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6)) {
                    number = (number / Math.pow(10, 6)).toFixed(1) + "m";
                }
                else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3)) {
                    number = (number / Math.pow(10, 3)).toFixed(1) + "k";
                }
            }
            return number;
        };
    });


    app.filter('to_trusted_html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }]);
}(angular.module("angularHorizonsPublicView.filters")));
(function (faveeoApi) {


    faveeoApi.factory('FaveeoApiInfluencers', ['$q', 'Restangular', function ($q, Restangular) {
        var factory = {};
        factory.path = "twitterinfluencers2/";
        factory.restangularAPI = Restangular.all(factory.path);

        factory.getExamples = function (socialMagazineId, successCallback, errorCallback) {
            factory.restangularAPI.one(socialMagazineId + "/examples").getList().then(
                successCallback,
                HttpErrorHandler.useDefaultCallbackIfUndefined(errorCallback)
            );
        };

        factory.getInfluencers = function (socialMagazineId, successCallback, errorCallback) {
            factory.restangularAPI.one(socialMagazineId + "/influencers").getList().then(
                successCallback,
                HttpErrorHandler.useDefaultCallbackIfUndefined(errorCallback)
            );
        };

        return factory;
    }]);


}(angular.module("angularHorizonsPublicView.faveeoApi")));

(function (faveeoApi) {

    faveeoApi.factory('FaveeoApiConfig', function (Restangular) {
		var factory = {};
		factory.init = function(serverUrl) {
			Restangular.setDefaultHeaders({
				'Content-Type': 'application/json'
			});
			Restangular.setBaseUrl(serverUrl);
		};
		return factory;
    });

    faveeoApi.factory('FaveeoApiHorizonsContent', ['$q', 'Restangular', function ($q, Restangular) {
        var factory = {};
        factory.path = "twitterinfluencers2/";
        factory.restangularAPI = Restangular.all(factory.path);

        /**
         * Get influencers content
         * @param socialMagazineId
         * @param dateRange
         * @param page
         * @param pageSize
         * @param forceRefresh To require content to be computed, breaking the cache of the API
         * @param successCallback
         * @param errorCallback
         */
        factory.getContent = function (socialMagazineId, dateRange, page, pageSize, forceRefresh, successCallback, errorCallback) {

            var queryParams = {
                page: page,
                pagesize: pageSize
            };

            var dateRangeInt = parseInt(dateRange);
            if (dateRangeInt > 0) {
                queryParams.from = "d" + dateRangeInt;
            }

            // If requested add a cache breaker parameter with a random value
            if (forceRefresh === true) {
                queryParams.cb = new Date().getTime() * (Math.random() + 1);
            }

            factory.restangularAPI.withHttpConfig({timeout: factory.getContentDeferred.promise}).customGET(socialMagazineId + "/content", queryParams).then(
                successCallback,
                errorCallback
            );
        };

        // gives the ability to cancel all ongoing getContent queries
        // used when changing filter / date while staying in the same page
        factory.getContentDeferred = $q.defer();
        factory.abortGetContent = function () {
            factory.getContentDeferred.resolve();
            factory.getContentDeferred = $q.defer();
        };

		/**
         * Fetches expanded content for url
         * @param url
         * @returns {*}
         */
        factory.getArticleForUrl = function (url) {
            var queryParams = {url: url};
            return factory.restangularAPI.withHttpConfig({timeout: factory.getArticleForUrlDeferred.promise}).customGET("articleforurl", queryParams);
        };

        // gives the ability to cancel all ongoing getArticleForUrl queries
        // used when changing filter / date while staying in the same content page
        factory.getArticleForUrlDeferred = $q.defer();
        factory.abortGetArticleForUrl = function () {
            factory.getArticleForUrlDeferred.resolve();
            factory.getArticleForUrlDeferred = $q.defer();
        };

        return factory;
    }]);


}(angular.module("angularHorizonsPublicView.faveeoApi")));

(function (app) {
    app.factory('HttpErrorEvents', function () {
        var factory = {};
        factory.HTTP_ERROR_4XX = 'HTTP_ERROR_4XX';
        factory.HTTP_ERROR_5XX = 'HTTP_ERROR_5XX';
        factory.HTTP_OTHER_ERROR = 'HTTP_OTHER_ERROR';
        factory.HTTP_ERROR = 'HTTP_ERROR';
        return factory;
    });
}(angular.module("angularHorizonsPublicView.factories")));

(function (app) {
    'use strict';
    app.factory('HttpErrorHandler', function ($rootScope, HttpErrorEvents) {
        var factory = {};

        /**
         * If the callBackFunc is undefined, returns defaultErrorCallback
         * @param callBackFunc
         */
        factory.useDefaultCallbackIfUndefined = function (callBackFunc) {
            return angular.isFunction(callBackFunc) ? callBackFunc : factory.defaultErrorCallback;
        };

        /**
         * Default http error handler.
         * Handle the http errors by broadcasting specific events
         * related to the HTTP errors
         *
         * @param response
         */
        factory.defaultErrorCallback = function (response) {
            // broadcast a generic error event
            $rootScope.$broadcast(HttpErrorEvents.HTTP_ERROR, "Sorry, an unexpected error happened (" + response.status + "). Please report the issue or try again later.");

            // broadcast specific error events
            switch (response.status) {
            case 404:
            case 408:
                $rootScope.$broadcast(HttpErrorEvents.HTTP_ERROR_4XX, "Sorry, the server could not be reached. Please check your connection and try again");
                break;
            case 500:
            case 501:
            case 502:
            case 503:
            case 504:
            case 505:
                $rootScope.$broadcast(HttpErrorEvents.HTTP_ERROR_5XX, "Sorry, our servers are experiencing some troubles. Our team is working on it. Please try again later.");
                break;
            default:
                $rootScope.$broadcast(HttpErrorEvents.HTTP_OTHER_ERROR, "Sorry, an unexpected error happened (" + response.status + "). Please report the issue or try again later.");
                break;
            }
        };

        return factory;
    });
}(angular.module("angularHorizonsPublicView.factories")));

angular.module('angularHorizonsPublicView.directives').directive('article', function () {
    return {
        restrict: 'E',
        scope: {
            baseline: '=',
            showimages: '='
        },
        templateUrl: "angular-horizons-public-view/directives/article/article.tpl.html",
        replace: true,
        controller: ['$scope', 'FaveeoApiHorizonsContent',  function ($scope, FaveeoApiHorizonsContent) {

            $scope.article = { twitterReferences: $scope.baseline.twitterReferences, highlights: $scope.baseline.highlights};
            var baselineDocument = $scope.baseline.document;
            if (angular.isUndefined(baselineDocument.extractorType) || baselineDocument.extractorType === 'faveeo') {
                FaveeoApiHorizonsContent.getArticleForUrl(baselineDocument.url).then(
                    function (doc) {
                        if(angular.isDefined(doc)) {
                            $scope.article.document = enhanceBaselineDocument(doc);
                        } else {
                            $scope.article.document = baselineDocument;
                        }
                    },
                    function (error) {
                        $scope.article.document = baselineDocument;
                    });
            } else {
                $scope.article.document = baselineDocument;
            }

            function enhanceBaselineDocument(document) {
                baselineDocument.automaticsummary = document.excerpt;
                baselineDocument.imageurl = document.imageurl;
                baselineDocument.title = document.title;
                if(angular.isDefined(document.pubdate)) {
                    baselineDocument.pubdate = document.pubdate;
                }
                return baselineDocument;
            }
        }]
    };
});


angular.module('angularHorizonsPublicView.directives').directive('classicarticle', function () {
    return {
        restrict: 'E',
        scope: {
            entry: '=',
            trefs: '=',
            highlights: '=',
            showimages: '=',
            onclose: '&'
        },
        data: "",
        templateUrl: "angular-horizons-public-view/directives/classicArticle/classicArticle.tpl.html",
        replace: true,
        controller: ['$scope', '$rootScope', '$timeout', function ($scope, $rootScope, $timeout) {
            if (angular.isDefined($rootScope.assetsPath)) {
                //remove trailing slash in the path
                $scope.assetspath = $rootScope.assetsPath.replace(/\/$/, '');
            } else {
                $scope.assetspath = 'assets';
            }

            $scope.addThisClass = "addthis" + new Date().getTime() + Math.random();
            $scope.showShareButtons = false;
            $scope.showShare = false;

            $scope.hasArticle = function () {
                return angular.isDefined($scope.entry);
            };

            //update addthis script and parameters for the current article
            function checkaddThisLoaded() {
                if (typeof addthis !== 'undefined') {
                    $scope.$evalAsync(function() { $scope.updateAddThis(); } );
                } else {
                    $timeout(checkaddThisLoaded,500);
                }
            }
            $scope.updateAddThis = function() {
                addthis.toolbox('.' + $scope.addThisClass, {}, {
                    'url': $scope.entry.url,
                    'title': $scope.entry.title,
                    'description': $scope.entry.automaticsummary
                });
            };

            $timeout(checkaddThisLoaded,200);
        }]
    };
});


angular.module('angularHorizonsPublicView.directives').directive('httperrorwarning', function () {
    'use strict';
    return {
        restrict: 'E',
        scope: {
            only_global_error: '='
        },
        templateUrl: "angular-horizons-public-view/directives/httpErrorWarning/httperrorwarning.tpl.html",
        replace: true,
        controller: ['$scope', 'HttpErrorEvents', function ($scope, HttpErrorEvents) {
            $scope.hideErrors = function () {
                $scope.isError = false;
                $scope.errorValue = "";
            };

            var onlyGlobalError = $scope.only_global_error || false;

            // listen to the global error or the detailed ones
            if (onlyGlobalError) {
                $scope.$on(HttpErrorEvents.HTTP_ERROR, function () {
                    $scope.isError = true;
                    $scope.errorValue = "HTTP_ERRORS.ALL";
                });
            } else {
                $scope.$on(HttpErrorEvents.HTTP_ERROR_4XX, function () {
                    $scope.isError = true;
                    $scope.errorValue = "HTTP_ERRORS.4XX";
                });
                $scope.$on(HttpErrorEvents.HTTP_ERROR_5XX, function () {
                    $scope.isError = true;
                    $scope.errorValue = "HTTP_ERRORS.5XX";
                });
                $scope.$on(HttpErrorEvents.HTTP_OTHER_ERROR, function () {
                    $scope.isError = true;
                    $scope.errorValue = "HTTP_ERRORS.OTHER";
                });
            }

            $scope.hideErrors();
        }]
    };
});


(function (app) {
        app.directive('simpleview',
            function () {
                return {
                    restrict: 'EA',
                    templateUrl: 'angular-horizons-public-view/directives/simpleView/simpleView.tpl.html',
                    scope: {
                        config: '='
                    },
                    replace: false,
                    controller: ['$scope', '$rootScope', 'FaveeoApiHorizonsContent',
                        function ($scope, $rootScope, FaveeoApiHorizonsContent) {
                            $scope.lastArticleLoaded = false;
                            $scope.loading = false;
                            $scope.articles = [];
                            $scope.page = 1;
                            $scope.dateRange = $scope.config.dateRange;
                            $scope.pageSize = $scope.config.pageSize;
                            $scope.socialMagazineId = $scope.config.socialMagazineId;

                            $scope.newPage = function () {
                                $scope.articles = [];
                                $scope.page = 1;
                                $scope.getContent();
                            };

                            $scope.setNewDateRange = function(dateRange) {
                                $scope.dateRange = dateRange;
                                $scope.init();
                            };

                            $scope.getContent = function () {
                                FaveeoApiHorizonsContent.abortGetArticleForUrl();
                                FaveeoApiHorizonsContent.abortGetContent();
                                $scope.loading = true;
                                FaveeoApiHorizonsContent.getContent($scope.socialMagazineId, $scope.dateRange, $scope.page, $scope.pageSize, false,
                                    function (data) {
                                        $scope.lastArticleLoaded = true;
                                        try {
                                            if (angular.isDefined(data.content) && data.content.length > 0) {
                                                //remove images if required
                                                if (!$scope.config.showImages) {
                                                    for (var i in data.content) {
                                                        data.content[i].document.imageurl = null;
                                                    }
                                                }
                                                $scope.articles.push.apply($scope.articles, data.content);
                                                $scope.lastArticleLoaded = false;
                                            }

                                            $scope.loading = false;
                                        } catch (e) {
                                            $scope.loading = false;
                                            console.log("Error parsing articles:\n\n" + e);
                                        }
                                    },
                                    function (error) {
                                        $scope.lastArticleLoaded = true;
                                        if (error.config.timeout) {
                                            // loading canceled
                                        } else {
                                            console.log("Error loading articles:\n\n" + error);
                                            $scope.loading = false;
                                        }
                                    }
                                );
                            };

                            $scope.getNextPage = function() {
                                $scope.page++;
                                $scope.getContent();
                            };

                            $scope.newPage();
                        }]
                };
            }
        );

    }(angular.module("angularHorizonsPublicView.simpleView"))
);

angular.module("angularHorizonsPublicView").run(["$templateCache", function($templateCache) {$templateCache.put("angular-horizons-public-view/directives/article/article.tpl.html","<div>\n  <classicarticle ng-if=\"article.document\" entry=\"article.document\" showimages=\"showimages\" trefs=\"article.twitterReferences\" highlights=\"article.highlights\" shareassetspath=\"{{assetspath}}\"></classicarticle>\n</div>\n");
$templateCache.put("angular-horizons-public-view/directives/classicArticle/classicArticle.tpl.html","<div class=\"article\" ng-mouseover=\"isHover = true\" ng-mouseleave=\"showShareButtons = false; isHover = false\">\n    <div ng-show=\"hasArticle()\">\n        <h6 class=\"mg-md clearfix\" ng-dblclick=\"showHighlight=!showHighlight\" ng-show=\"entry.pubdate\">\n            <span class=\"float-left\">{{entry.pubdate | timeSince}} ago</span>\n        </h6>\n\n        <div class=\"boxmask\" ng-if=\"showimages\">\n            <a href=\"{{entry.url}}\" target=\"_blank\">\n                <img ng-src=\"{{entry.imageurl}}\"\n                     class=\"img-responsive\" article-image>\n            </a>\n        </div>\n        <div>\n            <h5 class=\"mg-md\">\n                <a href=\"{{entry.url}}\" target=\"_blank\"\n                   >\n                    {{entry.title | default:\'Click here to view article\'}}\n                </a>\n            </h5>\n\n            <p class=\"summary\">\n                <a href=\"{{entry.url}}\" target=\"_blank\"\n                   ng-bind-html=\"entry.automaticsummary | cut:true:535:\' ...\' | nl2br\">\n                </a>\n            </p>\n            <dl class=\"highlights\" ng-repeat=\"hlt in highlights\" ng-if=\"showHighlight\">\n                <dt>In {{hlt.field}}:</dt>\n                <dd ng-repeat=\"fragment in hlt.fragments\" ng-bind-html=\"fragment|to_trusted_html\"></dd>\n            </dl>\n            <h6 class=\"mg-md\" ng-if=\"entry.urlFQDN\">\n                <a href=\"{{entry.url}}\" target=\"_blank\">\n                    {{entry.urlFQDN | cleanHostName}}\n                </a>\n            </h6>\n        </div>\n    </diV>\n    <span class=\"twitter-img\" ng-repeat=\"tr in trefs\">\n        <a href=\"{{tr.tweetURL}}\" target=\"_blank\">\n            <img class=\"img-thumbnail twitteruser-img\" ng-src=\"{{tr.authorImageURL}}\"\n                 alt=\"{{tr.authorName}}\" fallback-twitter-src-img=\"{{tr.authorName}}\"/>\n        </a>\n    </span>\n    <hr>\n    <div class=\"share-container text-center\" ng-show=\"hasArticle()\">\n        <div class=\"action-buttons text-center\">\n            <a href=\"\" ng-click=\"showShareButtons = true\" ng-show=\"isHover\">\n                <i class=\"fa fa-share-alt\"></i> Share Article\n            </a>\n        </div>\n        <!-- AddThis Button BEGIN -->\n        <div data-addthis-toolbox data-url=\"{{entry.url}}\" data-title=\"{{entry.title}}\"\n             data-description=\"{{entry.automaticsummary}}\"\n             class=\"addthis_toolbox addthis_default_style {{addThisClass}}\" ng-show=\"showShareButtons\">\n            <a class=\"addthis_button_twitter\"><img ng-src=\"{{assetspath+\'/shareIcons/twitter.png\'}}\"></a>\n            <a class=\"addthis_button_facebook\"><img ng-src=\"{{assetspath+\'/shareIcons/facebook.png\'}}\"></a>\n            <a class=\"addthis_button_linkedin\"><img ng-src=\"{{assetspath+\'/shareIcons/linkedin.png\'}}\"></a>\n            <a class=\"addthis_button_google_plusone_share\"><img ng-src=\"{{assetspath+\'/shareIcons/googleplus.png\'}}\"></a>\n            <a class=\"addthis_button_evernote\"><img ng-src=\"{{assetspath+\'/shareIcons/evernote.png\'}}\"></a>\n            <a class=\"addthis_button_mailto\"><img ng-src=\"{{assetspath+\'/shareIcons/mail.png\'}}\"></a>\n            <a class=\"addthis_button_pocket\"><img ng-src=\"{{assetspath+\'/shareIcons/pocket.png\'}}\"></a>\n            <a class=\"addthis_button_buffer\"><img ng-src=\"{{assetspath+\'/shareIcons/buffer.png\'}}\"></a>\n        </div>\n    </div>\n</div>\n");
$templateCache.put("angular-horizons-public-view/directives/httpErrorWarning/httperrorwarning.tpl.html","<div class=\"http-error-warning-container warning-container\"  ng-show=\"isError\">\n    <div class=\"row col-xs-12 text-center well http-error-text\">\n        <span class=\"\">{{ errorValue | translate }}\n        </span>\n        <button type=\"button\" class=\"close\" aria-label=\"Close\" ng-click=\"hideErrors();\">\n            <span aria-hidden=\"true\">&times;</span>\n        </button>\n    </div>\n</div>\n");
$templateCache.put("angular-horizons-public-view/directives/simpleView/simpleView.tpl.html","<div class=\"simpleview-container\" ng-cloak ng-show=\"socialMagazineId!=\'\'\">\n    <section class=\"article-container\">\n        <div class=\"row\">\n            <div ng-repeat=\"article in articles\">\n                <div ng-if=\"$index % 2 == 0\" class=\"clearfix visible-md-block\"></div>\n                <div ng-if=\"$index % 3 == 0\" class=\"clearfix visible-lg-block\"></div>\n                <div class=\"col-lg-4 col-md-6 col-sm-12 col-xs-12 text-left\">\n                    <article baseline=\"article\" showimages=\"config.showImages\"></article>\n                </div>\n            </div>\n        </div>\n        <div class=\"row text-center show-more\" ng-show=\"!lastArticleLoaded && !loading\">\n            <button class=\"btn btn-default show-more-button\" ng-click=\"getNextPage()\">\n                Show more\n            </button>\n        </div>\n    </section>\n\n    <div class=\"container\">\n        <div ng-show=\"articles.length == 0 && !loading\">\n            <div class=\"row\">\n                <div class=\"col-xs-12 text-center \">\n                    <h3 class=\"text-warning\">Sorry no articles found for that period of time.</h3>\n                </div>\n            </div>\n        </div>\n    </div>\n\n    <div class=\"loading row\" ng-show=\"loading\">\n        <div class=\"col-xs-12 text-center\">\n            <i class=\"fa fa-refresh fa-spin fa-5x\"></i>\n        </div>\n    </div>\n\n    <script src=\"//s7.addthis.com/js/300/addthis_widget.js#pubid=\"></script>\n</div>\n");}]);
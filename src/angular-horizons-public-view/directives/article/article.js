angular.module('angularHorizonsPublicView.directives').directive('article', function () {
    return {
        restrict: 'E',
        scope: {
            baseline: '=',
            showimages: '='
        },
        templateUrl: "horizons-common/directives/article/article.tpl.html",
        replace: true,
        controller: ['$scope', 'FaveeoApiTwitterInfluencers',  function ($scope, FaveeoApiTwitterInfluencers) {

            $scope.article = { twitterReferences: $scope.baseline.twitterReferences, highlights: $scope.baseline.highlights};
            var baselineDocument = $scope.baseline.document;
            if (angular.isUndefined(baselineDocument.extractorType) || baselineDocument.extractorType === 'faveeo') {
                FaveeoApiTwitterInfluencers.getArticleForUrl(baselineDocument.url).then(
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


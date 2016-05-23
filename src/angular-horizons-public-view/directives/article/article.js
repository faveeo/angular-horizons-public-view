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


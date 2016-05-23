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
        templateUrl: "angularHorizonsPublicView/directives/classicArticle/classicArticle.tpl.html",
        replace: true,
        controller: ['$scope', '$rootScope', '$translate', '$timeout', 'timeSinceTranslatedFilter', function ($scope, $rootScope, $translate, $timeout, timeSinceTranslated) {
            if (angular.isDefined($rootScope.assetsPath)) {
                //remove trailing slash in the path
                $scope.assetspath = $rootScope.assetsPath.replace(/\/$/, '');
            } else {
                $scope.assetspath = 'assets';
            }

            $scope.timeSinceTranslated = "";
            $translate.onReady(function() {
                var value = timeSinceTranslated($scope.entry.pubdate);
                $scope.timeSinceTranslated = $translate.instant("FILTERS.TIME_SINCE_TRANSLATED." + value.type, {'count': value.count});
            });

            $scope.addThisClass = "addthis" + new Date().getTime();
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
            checkaddThisLoaded();
        }]
    };
});


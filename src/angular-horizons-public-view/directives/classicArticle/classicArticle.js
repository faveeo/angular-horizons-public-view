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
        controller: ['$scope', '$rootScope', '$translate', '$timeout', 'timeSinceTranslatedFilter', 'AppEvents', function ($scope, $rootScope, $translate, $timeout, timeSinceTranslated, AppEvents) {
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

            //Broadcast document events
            $scope.clickEvent = function () {
                $rootScope.$broadcast(AppEvents.DOCUMENT_CLICK_EVENT, $scope.entry.url);
            };
            $scope.saveEvent = function () {
                $rootScope.$broadcast(AppEvents.DOCUMENT_SAVE_EVENT, $scope.entry.url);
            };
            $scope.hideEvent = function () {
                $rootScope.$broadcast(AppEvents.DOCUMENT_HIDE_EVENT, $scope.entry.url);
            };

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


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
                console.log(typeof addthis);

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


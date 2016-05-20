(function (app) {
        app.directive('simpleview',
            function () {
                return {
                    restrict: 'EA',
                    templateUrl: 'widgets/simpleView.tpl.html',
                    scope: {
                        config: '='
                    },
                    replace: false,
                    controller: ['$scope', '$rootScope', 'FaveeoApi',
                        function ($scope, $rootScope, FaveeoApi) {
                            $scope.lastArticleLoaded = false;
                            $scope.loading = false;
                            $scope.articles = [];
                            $scope.page = 1;
                            $scope.dateRange = 7;
                            $scope.pageSize = 10;
                            $scope.socialMagazineId = '496eeb1d-f689-4a0b-a693-a7ea80b6816d';

                            $scope.init = function () {
                                $scope.articles = [];
                                $scope.page = 1;
                                $scope.getContent();
                            };

                            $scope.getContent = function () {
                                FaveeoApi.abortGetArticleForUrl();
                                FaveeoApi.abortGetContent();
                                $scope.loading = true;
                                FaveeoApi.getContent($scope.socialMagazineId, $scope.dateRange, $scope.page, $scope.pagesize, false,
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

                            $scope.init();
                        }]
                };
            }
        );

    }(angular.module("angularHorizonsPublicView.simpleView", [
        'angularHorizonsPublicView.directives',
        'angularHorizonsPublicView.filters',
        'angularHorizonsPublicView.factories',
        'angularHorizonsPublicView.faveeoApi',
        'ngAnimate'
    ]))
);

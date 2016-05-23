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

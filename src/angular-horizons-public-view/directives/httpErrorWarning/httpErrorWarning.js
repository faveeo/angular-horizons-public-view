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


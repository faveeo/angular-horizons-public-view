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

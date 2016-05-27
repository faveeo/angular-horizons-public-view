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

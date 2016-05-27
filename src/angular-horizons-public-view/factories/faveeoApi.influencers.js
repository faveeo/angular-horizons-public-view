(function (faveeoApi) {


    faveeoApi.factory('FaveeoApiInfluencers', ['$q', 'Restangular', function ($q, Restangular) {
        var factory = {};
        factory.path = "twitterinfluencers2/";
        factory.restangularAPI = Restangular.all(factory.path);

        factory.getExamples = function (socialMagazineId, successCallback, errorCallback) {
            factory.restangularAPI.one(socialMagazineId + "/examples").getList().then(
                successCallback,
                HttpErrorHandler.useDefaultCallbackIfUndefined(errorCallback)
            );
        };

        factory.getInfluencers = function (socialMagazineId, successCallback, errorCallback) {
            factory.restangularAPI.one(socialMagazineId + "/influencers").getList().then(
                successCallback,
                HttpErrorHandler.useDefaultCallbackIfUndefined(errorCallback)
            );
        };

        return factory;
    }]);


}(angular.module("angularHorizonsPublicView.faveeoApi")));

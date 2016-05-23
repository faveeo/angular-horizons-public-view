(function (faveeoApi) {

    faveeoApi.factory('FaveeoApiConfig', function (Restangular) {
		var factory = {};
		factory.init = function(serverUrl) {
			Restangular.setDefaultHeaders({
				'Content-Type': 'application/json'
			});
			Restangular.setBaseUrl(serverUrl);
		};
		return factory;
    });

    faveeoApi.factory('FaveeoApiHorizonsContent', ['$q', 'Restangular', function ($q, Restangular) {
        var factory = {};
        factory.path = "twitterinfluencers2/";
        factory.restangularAPI = Restangular.all(factory.path);

        /**
         * Get influencers content
         * @param socialMagazineId
         * @param dateRange
         * @param page
         * @param pageSize
         * @param forceRefresh To require content to be computed, breaking the cache of the API
         * @param successCallback
         * @param errorCallback
         */
        factory.getContent = function (socialMagazineId, dateRange, page, pageSize, forceRefresh, successCallback, errorCallback) {

            var queryParams = {
                page: page,
                pagesize: pageSize
            };

            var dateRangeInt = parseInt(dateRange);
            if (dateRangeInt > 0) {
                queryParams.from = "d" + dateRangeInt;
            }

            // If requested add a cache breaker parameter with a random value
            if (forceRefresh === true) {
                queryParams.cb = new Date().getTime() * (Math.random() + 1);
            }

            factory.restangularAPI.withHttpConfig({timeout: factory.getContentDeferred.promise}).customGET(socialMagazineId + "/content", queryParams).then(
                successCallback,
                errorCallback
            );
        };

        // gives the ability to cancel all ongoing getContent queries
        // used when changing filter / date while staying in the same page
        factory.getContentDeferred = $q.defer();
        factory.abortGetContent = function () {
            factory.getContentDeferred.resolve();
            factory.getContentDeferred = $q.defer();
        };

		/**
         * Fetches expanded content for url
         * @param url
         * @returns {*}
         */
        factory.getArticleForUrl = function (url) {
            var queryParams = {url: url};
            return factory.restangularAPI.withHttpConfig({timeout: factory.getArticleForUrlDeferred.promise}).customGET("articleforurl", queryParams);
        };

        // gives the ability to cancel all ongoing getArticleForUrl queries
        // used when changing filter / date while staying in the same content page
        factory.getArticleForUrlDeferred = $q.defer();
        factory.abortGetArticleForUrl = function () {
            factory.getArticleForUrlDeferred.resolve();
            factory.getArticleForUrlDeferred = $q.defer();
        };

        return factory;
    }]);


}(angular.module("angularHorizonsPublicView.faveeoApi")));

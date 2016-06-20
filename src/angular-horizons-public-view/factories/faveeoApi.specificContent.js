(function (faveeoApi) {


	faveeoApi.factory('FaveeoApiSpecificContent', ['$q', 'Restangular', 'HttpErrorHandler', function ($q, Restangular, HttpErrorHandler) {
		var factory = {};
		factory.path = "twitterinfluencers2/";
		factory.restangularAPI = Restangular.all(factory.path);

		/**
		 * Get influencers content
		 * @param socialMagazineId
		 * @param dayStart Number of days to skip before getting content
		 * @param dayRange Number of days to get content for
		 * @param page
		 * @param pageSize
		 * @param forceRefresh To require content to be computed, breaking the cache of the API
		 * @param successCallback
		 * @param errorCallback
		 */
		factory.getContent = function (socialMagazineId, dayStart, dayRange, page, pageSize, extraParameters, forceRefresh, successCallback, errorCallback) {

			var queryParams = {
				page: page,
				pagesize: pageSize
			};

			var dayStartInt = parseInt(dayStart);
			if (dayStartInt > 0) {
				queryParams.to = "d" + dayStartInt;
			}
			var dayRangeInt = parseInt(dayRange);
			if (dayRangeInt > 0) {
				queryParams.from = "d" + (dayRangeInt + dayStartInt);
			}

			angular.forEach(extraParameters, function (value, key) {
				queryParams[key] = value;
			});

			// If requested add a cache breaker parameter with a random value
			if (forceRefresh === true) {
				queryParams.cb = new Date().getTime() * (Math.random() + 1);
			}

			factory.restangularAPI.withHttpConfig({timeout: factory.getContentDeferred.promise}).customGET(socialMagazineId + "/content", queryParams).then(
				function (data) {
					successCallback(data.content);
				},
				HttpErrorHandler.useDefaultCallbackIfUndefined(errorCallback)
			);
		};

		// gives the ability to cancel all ongoing getContent queries
		// used when changing filter / date while staying in the same page
		factory.getContentDeferred = $q.defer();
		factory.abortGetContent = function () {
			factory.getContentDeferred.resolve();
			factory.getContentDeferred = $q.defer();
		};

		return factory;
	}]);


}(angular.module("angularHorizonsPublicView.faveeoApi")));

(function (angular) {

	// Create all modules and define dependencies to make sure they exist
	// and are loaded in the correct order to satisfy dependency injection
	// before all nested files are concatenated by Gulp

	// Modules
	angular.module('angularHorizonsPublicView.directives',
		[]);
	angular.module('angularHorizonsPublicView.filters',
		[
			'rt.iso8601'
		]);
	angular.module('angularHorizonsPublicView.faveeoApi',
		[
			'restangular'
		]);
	angular.module("angularHorizonsPublicView.simpleView",
		[
		]);

	angular.module('angularHorizonsPublicView',
		[
			'angularHorizonsPublicView.directives',
			'angularHorizonsPublicView.filters',
			'angularHorizonsPublicView.faveeoApi',
			'angularHorizonsPublicView.simpleView'
		]);

})(angular);

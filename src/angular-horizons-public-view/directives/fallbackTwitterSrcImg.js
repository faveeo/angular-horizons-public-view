angular.module('angularHorizonsPublicView.directives').directive('fallbackTwitterSrcImg', function () {
	return {
		link: function postLink(scope, element, attrs) {
			element.on('error', function () {
				element[0].src = 'http://avatars.io/twitter/' + attrs.fallbackTwitterSrcImg;
			});
		}
	};
});

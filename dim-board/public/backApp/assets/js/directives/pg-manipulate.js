angular.module('dim')
	.directive('pgManipulate', function() {
		
	return {
		restrict: 'A',
		link: function(scope, element, attrs, fn) {

			$(element).click(function () {
				var $this    = $(this),
					quikView = $this.attr('data-hided-view');

				$(quikView).removeClass('push-parrallax');
			});
		}
	};
});
angular
	.module('cards')
	.controller('CardShareCtrl',function($scope){
		$scope.url = '';
		$scope.iframe = '';

		init();

		function init() {
			initZeroClipboard();
		}
		
		/**
		 * @name initZeroClipboard
		 * @desc Gets button and converts it into
		 * a flash object for copying to clipboard.
		 */
		function initZeroClipboard() {
			new ZeroClipboard( document.getElementById("copy-card-url") );
			new ZeroClipboard( document.getElementById("copy-card-iframe") );
		}

		$scope.$watch(function() {
			return $scope.selectedCard;
		}, function(selectedCard) {
			if(selectedCard._id) {
				$scope.url = 'http://hearstcharts.com/view/cards/' + selectedCard._id;
				$scope.iframe = '<iframe src="http://hearstcharts.com/view/cards/'+ selectedCard._id +'"></iframe>';
				init();
			}
		});

});
angular
	.module('dashboards')
	.controller('DashboardsShareCtrl',function($scope){
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
			new ZeroClipboard( document.getElementById("copy-dashboard-url") );
			new ZeroClipboard( document.getElementById("copy-dashboard-iframe") );
		}

		$scope.$watch(function() {
			return $scope.selectedDashboard;
		}, function(selectedDashboard) {
			if(selectedDashboard._id) {
				$scope.url = 'http://hearstcharts.com/view/dashboard/' + selectedDashboard._id;
				$scope.iframe = '<iframe src="http://hearstcharts.com/view/dashboard/'+ selectedDashboard._id +'"></iframe>';
				init();
			}
		});

});
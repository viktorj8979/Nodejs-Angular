(function(){

'use strict';

/**
 * DashboardsViewCtrl Controllers
 * @namespace Controllers
 */

angular.module('dashboards')
    .controller('DashboardsViewCtrl', DashboardsViewCtrl);

DashboardsViewCtrl.$inject = ['$stateParams', '$scope', '$http', '$timeout', '$compile', '$modal', 'Dashboards', 'auth', 'SweetAlert'];

	function DashboardsViewCtrl($stateParams, $scope, $http, $timeout, $compile, $modal, Dashboards, auth, SweetAlert) {
		$scope.openTextModal = openTextModal;

		function openTextModal(){
			$modal.open({
			    templateUrl: '../backApp/dashboards/modal/addTextarea/addTextarea.html',
			    resolve: {
			    	cards: function(){
			    		return $scope.dashboard.cards
			    	}
			    },
			    controller: 'AddtextareaCtrl'
			}).result.then(function(){
			    
			});
		}
	}

})();
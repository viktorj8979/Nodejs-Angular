(function(){
'use strict';

angular
	.module('datasources')
	.controller('DatasourcesListCtrl', DatasourcesListCtrl);

	DatasourcesListCtrl.$inject = ['$scope', '$state', 'SweetAlert', '$modal', 'Datasources'];

	/**
	 * @name DatasourcesListCtrl
	 * @desc List datasources in list and grid views.
	 * @memberOf datasources
	 */
	function DatasourcesListCtrl($scope, $state, SweetAlert, $modal, Datas) {
		$scope.loading = true;
		$scope.view = 'list';
		$scope.displayView = displayView;
		$scope.predicate = 'datasource_name';
		$scope.reverse = true;
		$scope.order = order;
		$scope.selectedDatasources = [];
		$scope.selected = selected;
		$scope.select = select;
		$scope.selectAll = selectAll;
		$scope.deleteAll = deleteAll;
		$scope.deleteDatasource = deleteDatasource;
		$scope.uploadDatasource = uploadDatasource;
		$scope.replaceDatasource = replaceDatasource;
		$scope.createCard = createCard;
		$scope.viewDetails = viewDetails;

		init();

		function init() {
			//loadDatas();
		}

		/** 
		 * @name displayView
		 * @desc Open loadingDatas modal and load datasources.
		 */
		function displayView(type) {
			return !$scope.loading && ($scope.view === type);
		}

		function createCard(datasource) {
			$scope.useDatasourceToCreateCard = $.extend(true, $scope.useDatasourceToCreateCard, datasource);
			$state.go('cards.create');
		}

		/** 
		 * @name loadDatas
		 * @desc Open loadingDatas modal and load datasources.
		 */
		function loadDatas() {
			$modal.open({
			  templateUrl: 'app/datasources/modals/loadDatas/loadDatas.html',
      		  controller: 'LoaddatasourcesCtrl'
			}).result.then(function(datasources){
			  $scope.datasources = datasources;
			  $scope.loading = false;
			});	
		}

		/** 
		 * @name order
		 * @desc Change descending and ascending order of predicate.
		 */
		function order(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		}

		/** 
		 * @name selectAll
		 * @desc Add or Remove all datasources from $scope.selectedDatasources.
		 * @params {{Boolean}} selectAll, are we adding or removing datasources.
		 */
		function selectAll(selectAll) {
			if(selectAll) {
				$scope.selectedDatasources = angular.copy($scope.datasources);
			} else {
				$scope.selectedDatasources = [];
			}
		}

		/** 
		 * @name select
		 * @desc Check if datasource is in $scope.selectedDatasources.
		 * @params {{Object}} datasource, a datasource object.
		 */
		function select(datasource) {
			if(selected(datasource)) {
				$scope.selectedDatasources = _.reject($scope.selectedDatasources, function(item) {
					return item._id === datasource._id;
				});
			} else {
				$scope.selectedDatasources.push(datasource);
			}
		}

		/** 
		 * @name selected
		 * @desc Check if datasource is selected, in $scope.selectedDatasources.
		 * @params {{Object}} datasource, a datasource object.
		 * @return {{Boolean}} returns undefined if datasource is not found.
		 */
		function selected(datasource) {
			return _.findWhere($scope.selectedDatasources, {
				_id: datasource._id
			});
		}

		/** 
		 * @name deleteAll
		 * @desc Display a sweetalert to confirm datasources deletion.
		 * On cancel deletion, display a message that the datasources
		 * are safe and have not been deleted.
		 * On delete, display a message that the datasources have been deleted.
		 */
		function deleteAll() {
			var numberOfSelectedDatas = $scope.selectedDatasources.length;

			if(numberOfSelectedDatas > 0) {
				SweetAlert.swal({
				   title: 'Are you sure?',
				   text: 'You will not be able to recover these ' + numberOfSelectedDatas + ' datasources!',
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete them!",
				   cancelButtonText: "No, cancel please!",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
				   		Datas
			   				.deleteDatasources(getIdArray($scope.selectedDatasources))
			   				.then(success, error);
				   } else {
				      SweetAlert.swal("Cancelled", "Your datasources are safe :)", "error");
				   }
				});
			}

			function getIdArray(datasources) {
				var idArray = [];
				angular.forEach(datasources, function(datasource) { 
					idArray.push(parseInt(datasource._id, 10));
		   		});

				return idArray;
			}

			function success(response) {
				// remove datasources from datasources array.
		   		angular.forEach($scope.selectedDatasources, function(datasource) { 
		   			$scope.datasources = _.reject($scope.datasources, function(item) {
						return item._id === datasource._id;
					});
		   		});
		   		// empty selected datasources array.
		   		$scope.selectedDatasources = [];
				SweetAlert.swal("Deleted!", "Your datasources have been deleted.", "success");
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name deleteDatasource
		 * @desc Display a sweetalert to confirm datasource deletion.
		 * On cancel deletion, display a message that the datasource
		 * is safe and has not been deleted.
		 * On delete, display a message that the datasource has been deleted.
		 * @params {{Object}} datasource, a datasource object.
		 */
		function deleteDatasource(datasource) {
			SweetAlert.swal({
			   title: "Are you sure?",
			   text: "You will not be able to recover this datasource!",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
			   cancelButtonText: "No, cancel please!",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){ 
			   if (isConfirm) {
			   		Datas
		   				.deleteDatasources(datasource._id)
		   				.then(success, error);
			   } else {
			      SweetAlert.swal("Cancelled", "Your datasource is safe :)", "error");
			   }
			});

			function success(response) {
				// remove chart from datasources array.
		   		$scope.datasources = _.reject($scope.datasources, function(item) {
					return item._id === datasource._id;
				});
				$scope.selectedDatasources = _.reject($scope.selectedDatasources, function(item) {
					return item._id === datasource._id;
				});
				SweetAlert.swal("Deleted!", "Your datasource has been deleted.", "success");
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name uploadDatasource
		 * @desc Display a modal to upload new datasources.
		 */
		function uploadDatasource() {
			$modal.open({
			  templateUrl: 'app/datasources/modals/uploadDatasource/uploadDatasource.html',
			  controller: 'UploaddatasourcesCtrl'
			}).result.then(function(result){
			  //do something with the result
			});
		}

		/** 
		 * @name replaceDatasource
		 * @desc Display a modal to replace datasource.
		 * @params {{Object}} datasource, a datasource object.
		 */
		function replaceDatasource(data) {
			Datas.setReplacingInfo(data);
		}

		/**
		 * @name viewDetails
		 * @desc Save selected datasource for view details.
		 * @params {{Object}} datasource, a datasource object.
		 */
		function viewDetails(datasource) {
			console.log('data source:', datasource);
			$scope.viewDatasource = datasource;
		}
	}
})();
(function(){

'use strict';

/**
 * CardsDataCtrl Controllers
 * @namespace Controllers
 */

angular.module('cards')
    .controller('CardsDataCtrl', CardsDataCtrl);

CardsDataCtrl.$inject = ['$scope', 'Groups', 'Datasources', 'Card'];

function CardsDataCtrl($scope, Groups, Datasources, Card) {
    /** card  */
    $scope.card = Card;
    /** datasource */
    $scope.datasource = {};
    /** loading datasources. */
    $scope.loadingDatasources = true;
    /** list of datasources */
    $scope.datasources = [];
    /** card has datasource */
    $scope.hasDatasource = hasDatasource;
    /** card has datasource */
    $scope.addOrRemoveDatasource = addOrRemoveDatasource;
    /** view data from datasource */
    $scope.viewData = viewData;
    /** loading data. */
    $scope.loadingData = true;
    /** data for table */
    $scope.table = {};
    /** Go back to card */
    $scope.backToCard = backToCard;

    init();

    function init() {
    	getDatasources();
    }

    /** 
	 * @name getDatasources
	 * @desc Get list of datasources.
	 */
    function getDatasources() {
        Groups
            .getDatasourcesByGroupId($scope.selectedGroup._id)
            .then(success, error);

        function success(datasources) {
            $scope.datasources = datasources;
            $scope.loadingDatasources = false;
            viewData($scope.datasources[0]);
        }

        function error(error) {
            console.log('Get group datasources failed.', error);
        }
    }

    /** 
	 * @name hasDatasource
	 * @desc check if card has datasource added.
	 * @returns {{Boolean}} hasDatasource, true or false.
	 */
    function hasDatasource(datasource) {
    	var hasDatasource = false;

    	if(_.findWhere($scope.card.datasources, { _id: datasource._id })) {
    		hasDatasource = true;
    	}
    	
    	return hasDatasource;
    }

    /** 
	 * @name addOrRemoveDatasource
	 * @desc Add or remove datasource (to/from) card.
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function addOrRemoveDatasource(datasource) {
    	if(hasDatasource(datasource)) {
    		removeDatasource(datasource)
    	} else {
    		addDatasource(datasource)
    	}
    }

    /** 
	 * @name addDatasource
	 * @desc Add datasource to card.
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function addDatasource(datasource) {
    	$scope.card.datasources.push(datasource);
    }

    /** 
	 * @name removeDatasource
	 * @desc Remove datasource from card.
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function removeDatasource(datasource) {
		$scope.card.datasources = _.reject($scope.card.datasources, function(item) {
			return item._id === datasource._id;
		});
    }

    /**
	 * @name viewData
	 * @desc View data from datasource
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function viewData(datasource) {
    	$scope.datasource = datasource;
    	getData(datasource);
    }
    
    /**
	 * @name updateTableData
	 * @desc update table with data from datasource
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function updateTableData(datasource) {
    	$scope.table.columns = Datasources.formatColumnData(datasource.data);
        $scope.table.rows = Datasources.formatRowData(datasource.data);
    }


    /**
	 * @name getData
	 * @desc Get data from datasource.
	 * @params {{Oject}} datasource, the datasource object.
	 */
    function getData(datasource) {
    	$scope.loadingData = true;

        Datasources
            .S3.getFileData(datasource, function(err, data) {
                if (data) {
                    datasource.data = d3.csv.parse(data.Body.toString());
                    datasource.table = {};
                    datasource.table.columns = Datasources.formatColumnData(datasource.data, datasource._id);
                    datasource.table.rows = Datasources.formatRowData(datasource.data, datasource._id);
                    updateTableData(datasource);
                    // $scope.data.categories = onlyTextValues($scope.card.datasources.table.columns);
                    // $scope.data.values = onlyNumericValues($scope.card.datasources.table.columns);
                    $scope.loadingData = false;
                    setTableOptions();
                    $scope.$apply();
                }
            });
    }

    /** 
	 * @name setTableOptions
	 * @desc Set the options for table.
	 */
    function setTableOptions() {
    	var table = $('#tableWithExportOptions');
    	$scope.table.options = {};
    	$scope.table.options = {
            "sDom": "<'exportOptions'T><'table-responsive't><'row'<p i>>",
            "sPaginationType": "bootstrap",
            "destroy": true,
            "scrollCollapse": true,
            "oLanguage": {
                "sLengthMenu": "_MENU_ ",
                "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
            },
            "iDisplayLength": 5,
            "oTableTools": {
                "sSwfPath": "../backApp/assets/plugins/jquery-datatable/extensions/TableTools/swf/copy_csv_xls_pdf.swf",
                "aButtons": [{
                    "sExtends": "csv",
                    "sButtonText": "<i class='pg-grid'></i>",
                }, {
                    "sExtends": "xls",
                    "sButtonText": "<i class='fa fa-file-excel-o'></i>",
                }, {
                    "sExtends": "pdf",
                    "sButtonText": "<i class='fa fa-file-pdf-o'></i>",
                }, {
                    "sExtends": "copy",
                    "sButtonText": "<i class='fa fa-copy'></i>",
                }]
            },
            fnDrawCallback: function(oSettings) {
                $('.export-options-container').append($('.exportOptions'));

                $('#ToolTables_tableWithExportOptions_0').tooltip({
                    title: 'Export as CSV',
                    container: 'body'
                });

                $('#ToolTables_tableWithExportOptions_1').tooltip({
                    title: 'Export as Excel',
                    container: 'body'
                });

                $('#ToolTables_tableWithExportOptions_2').tooltip({
                    title: 'Export as PDF',
                    container: 'body'
                });

                $('#ToolTables_tableWithExportOptions_3').tooltip({
                    title: 'Copy data',
                    container: 'body'
                });
            }
        };
    }

    /** 
	 * @name backToCard
	 * @desc go back to card creation.
	 */
    function backToCard() {
    	angular.forEach($scope.card.datasources, function(datasource) {
    		$scope.$parent.addDataOptions(datasource);
    	});
    	$scope.$parent.switchView('card');
    }
}
})();
angular.module('cards').controller('CardsCreateDataOptionsCtrl',function($scope){
	/** Add column to table */
    $scope.addColumn = addColumn;
    $scope.selectedColumn = selectedColumn;

    /**
     * @function addColumn
     * @desc
     * Select or deselect a column.
     * If we have already selected the column, remove it from the filters array.
     * If we have not selected the column, add it to the filters array.
     * @param  {Object}    $event - prevent default behavior
     * @param  {Object}    column - column object
     */
    function addColumn(column) {
    	var tableColumns = $scope.$parent.cardOptionSelected.settings.selected.table.columns;
      if ($scope.selectedColumn(column)) {
        tableColumns = _.reject(tableColumns, function(filter) { return column.key === filter.key; });
      } else {
        tableColumns.push(column);
      }
    }

    /**
     * @function selectedColumn
     * @desc
     * Check if column has been selected.
     * If column is in filters return true, otherwise return false.
     * @param  {Object} column - column object
     * @return {boolean}
     */
    function selectedColumn(column) {
   		var tableColumns = $scope.$parent.cardOptionSelected.settings.selected.table.columns;
      return _.findWhere(tableColumns, { key: column.key });
    }

});
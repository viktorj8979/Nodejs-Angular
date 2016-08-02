(function() {
'use strict';

angular
	.module('cards')
	.controller('CardsCreateFiltersCtrl', CardsCreateFiltersCtrl);

	CardsCreateFiltersCtrl.$inject = ['$scope'];

	function CardsCreateFiltersCtrl($scope) {
	    $scope.filters = [];
	    $scope.columns = [];
	    $scope.selectAllColumns = selectAllColumns;
	    $scope.selectColumn = selectColumn;
	    $scope.selectedColumn = selectedColumn;

        /**
	     * @function getColumns
	     * @desc
	     * Get all available columns that can be used as filters.
	     * Only columns that were selected in the Categories & Values
	     * step can be used as filters.
	     */
	    function getColumns() {
			$scope.filters = $scope.$parent.cardOptionSelected.settings.selected.filters;

			var selected = $scope.$parent.cardOptionSelected.settings.selected;
			var columns = [];

			if(selected.categories && selected.categories.name) {
				columns.push(selected.categories);
			}
			if(selected.subcategories && selected.subcategories.name) {
				columns.push(selected.subcategories);
			}
			if(selected.values && selected.values.name) {
				columns.push(selected.values);
			}
			if(selected.table && selected.table.columns.length > 0) {
				columns = columns.concat(selected.table.columns);
			}

	    	$scope.columns = angular.copy(columns);
	    }

		/**
	     * @function selectAllColumns
	     * @desc
	     * Select or deselect all columns.
	     * If we have already selected all columns, empty the filters array.
	     * If we have not selected all columns, select all columns.
	     */
	    function selectAllColumns() {
	      if ($scope.filters.length === $scope.columns.length) {
	        $scope.filters = [];
	      } else {
	        $scope.filters = angular.copy($scope.columns);
	      }
	      populateFilters();
	    }

	    /**
	     * @function selectColumn
	     * @desc
	     * Select or deselect a column.
	     * If we have already selected the column, remove it from the filters array.
	     * If we have not selected the column, add it to the filters array.
	     * @param  {Object}    $event - prevent default behavior
	     * @param  {Object}    column - column object
	     */
	    function selectColumn($event, column) {
	      if ($scope.selectedColumn(column)) {
	        $scope.filters = _.reject($scope.filters, function(filter) { return column.key === filter.key; });
	      } else {
	        $scope.filters.push(populateFilter(column));
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
	      return _.findWhere($scope.filters, { key: column.key });
	    }

	    /**
	     * @function populateFilter
	     * @desc
	     * Populate options for all filters
	     */
	    function populateFilters() {
	      _.each($scope.filters, function(filter) {
	        filter.type = "checkbox";
	        filter.options = getFilterOptions(filter);
	      });
	    }

	    /**
	     * @function populateFilter
	     * @desc
	     * Populate options for a single filter
	     * @param  {Object} column - column object
	     * @return {Object} filter 
	     */
	    function populateFilter(filter) {
	      filter.type = "checkbox";
	      filter.options = getFilterOptions(filter);
	      return filter;
	    }

	    /**
	     * @function getFilterOptions
	     * @desc
	     * Returns an array of row objects matching the selected column (filter).
	     * @param  {Object} filter - filter object
	     * @return {Array.<Object>} options - filter options
	     */
	    function getFilterOptions(filter) {
	      var options = [];
	      _.each($scope.$parent.cardOptionSelected.settings.table.rows, function(row) {
	          var duplicate = _.findWhere(options, { name: row[filter.key] });
	          if(!duplicate) {
	            options.push({
	              key: filter.key,
	              name: row[filter.key],
	              selected: false
	            });
	          }
	      });
	      return options;
	    }

	    /**
         * Watch for changes to filters array and update
         * chartConfig selected filters.
         */
        $scope.$watch(function() {
            return $scope.$parent.activeStep;
        }, function(activeStep) {
          if(activeStep === 'filters') {
          	getColumns();
          }
        });

        /**
         * Watch for changes to filters array and update
         * chartConfig selected filters.
         */
        $scope.$watch(function() {
            return $scope.filters;
        }, function(newFilters, oldFilters) {
          if(newFilters !== oldFilters) {
            $scope.$parent.cardOptionSelected.settings.selected.filters = newFilters;
          }
        });
	}

})();
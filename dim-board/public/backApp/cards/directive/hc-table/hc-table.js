angular
	.module('cards')
	.directive('hcTable', hcTable);

	function hcTable() {
		var directive = {
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			templateUrl: '../backApp/cards/directive/hc-table/hc-table.html',
			link: {
				pre: hcTableLink
			},
			controller: hcTableController
		};

		return directive;
	}

	hcTableController.$inject = ['$scope', '$timeout', 'Datasources', 'Card'];

	function hcTableController($scope, $timeout, Datasources, Card) {
        var hasData = false;
        $scope.showTable = false;
        $scope.tableRows = [];
        $scope.selectAllOptions = selectAllOptions;
        $scope.filterChart = filterChart;


        init();

        function init() {
            getDatasource($scope.config.settings.datasource_id);
        }
        
        /**
         * @name getData
         * @desc Get data from datasource.
         * @params {{Oject}} datasource, the datasource object.
         */
        function getDatasource(datasourceId) {
            if (datasourceId) {

                Datasources
                    .getDatasource(datasourceId)
                    .then(success, error);

                    function success(datasource) {
                        getData(datasource);
                    }

                    function error(response) {

                    }
            }
        }

        /**
         * @name getData
         * @desc Get data from datasource.
         * @params {{Oject}} datasource, the datasource object.
         */
        function getData(datasource) {
            $scope.config.settings.loading = true;

            if($scope.config.settings.chooseData) {
              changeDatasource();
            }

            Datasources
                .S3.getFileData(datasource, function(err, data) {
                    if (data) {
                        var data = d3.csv.parse(data.Body.toString());
                        hasData = true;
                        $scope.config.settings.table.columns = Datasources.formatColumnData(data);
                        $scope.config.settings.table.rows = Datasources.formatRowData(data);
                        $scope.tableRows = $scope.tableRows.concat($scope.config.settings.table.rows);
                        $scope.config.settings.loading = false;
                        setTableOptions();
                        $scope.$apply();
                    }
                });
        }

        function changeDatasource() {
            $scope.config.settings.selected.table.columns = [];
            $scope.config.settings.selected.table.filters = [];
            $scope.config.settings.chooseData = false;
        }

        function selectAllOptions(filter) {
            _.each(filter.options, function(option) {
                if(filter.allSelected) {
                    option.selected = true;
                } else {
                    option.selected = false;
                }
            });
            $scope.filterChart();
        }

        function filterChart(globalFilters) {
          var filters = globalFilters? globalFilters : angular.copy($scope.config.settings.selected.filters);
          $scope.tableRows = filterRows(filters, $scope.config.settings.table.rows);
          if($scope.$parent.filterCharts && $scope.config.settings.linked && !globalFilters) {
            $scope.$parent.filterCharts($scope.config.settings.datasource_id, filters, $scope.config);
          }
        }

        function filterRows(filters, rows) {
          var filterdRows = angular.copy(rows);

          _.each(filters, function(filter) {
              var tmpResult = [];
              _.each(filter.options, function(option) {
                  if(option.selected === true) {
                      _.each(filterdRows, function (row) {
                          if(row[filter.key] === option.name) {
                              tmpResult.push(row);
                          }
                      });
                  }
              });
              if(tmpResult.length > 0) {
                  filterdRows = tmpResult;
              }
          });

          return filterdRows;
        }

        $scope.$watchCollection('config.settings.selected.table.columns', function(columns) {
            if(columns.length > 0 && hasData) {
                $timeout(setTableOptions, 100);
            }
        });

        $scope.$watch('config.settings.datasource_id', function(datasource_id) {
            getDatasource(datasource_id);
        });

        /** 
         * @name setTableOptions
         * @desc Set the options for table.
         */
        function setTableOptions() {
          if($scope.config.settings.selected.table.columns.length > 0) {
              var table = $('#tableWithExportOptions');
              //$scope.options = {};
              $scope.options = {
                  "sDom": "<'table-responsive't><'row'<p i>>",
                  "sPaginationType": "bootstrap",
                  "destroy": true,
                  "scrollCollapse": true,
                  "oLanguage": {
                      "sLengthMenu": "_MENU_ ",
                      "sInfo": "Showing <b>_START_ to _END_</b> of _TOTAL_ entries"
                  },
                  "iDisplayLength": 5
              };
              $scope.showTable = true;
          }
        }
	}

	function hcTableLink(scope, element, attrs, fn) {
        scope.deleteOption = deleteOption;
        scope.selectCardOption = scope.$parent.$parent.selectCardOption;

        if(typeof scope.config.chart === "string") {
            scope.config.chart = JSON.parse(scope.config.chart);
        }

        /**
         * @name deleteOption
         * @desc Delete card option.
         */
        function deleteOption() {
            scope.$parent.$parent.card.cardOptions = _.reject(scope.$parent.$parent.card.cardOptions, function(option) {
                return option === scope.config;
            });
            $(element).remove();
            scope.$destroy();
        }
	}




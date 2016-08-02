angular
	.module('cards')
	.directive('hcHighcharts', hcHighcharts);

	function hcHighcharts() {
		var directive = {
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			templateUrl: '../backApp/cards/directive/hc-highcharts/hc-highcharts.html',
			link: {
				pre: hcHighchartsLink
			},
			controller: hcHighchartsController
		};

		return directive;
	}

	hcHighchartsController.$inject = ['$scope', '$timeout', 'Series', 'Datasources', 'Card'];

	function hcHighchartsController($scope, $timeout, Series, Datasources, Card) {

		init();

		function init() {
			getDatasource($scope.config.settings.datasource_id);
		}

		/**
	     * @name getDatasource
	     * @desc Get datasource by id.
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
	                    $scope.config.settings.table.columns = Datasources.formatColumnData(data);
	                    $scope.config.settings.table.rows = Datasources.formatRowData(data);
	                    $scope.config.settings.loading = false;
	                    $scope.$apply();
	                }
	            });
	    }

	    function changeDatasource() {
            $scope.config.settings.selected.categories = {};
            $scope.config.settings.selected.values = {};
            $scope.config.settings.selected.subcategories = {};
            $scope.config.settings.chooseData = false;
        }

		$scope.selectAllOptions = function(filter) {
			_.each(filter.options, function(option) {
				if(filter.allSelected) {
					option.selected = true;
				} else {
					option.selected = false;
				}
			});
			$scope.filterChart();
		};

		$scope.filterChart = function(globalFilters) {
			var filters = globalFilters ? globalFilters : angular.copy($scope.config.settings.selected.filters);
			Series.getSeries($scope.config, $scope.config.settings.table, filters);
			if($scope.$parent.filterCharts  && $scope.config.settings.linked && !globalFilters) {
				$scope.$parent.filterCharts($scope.config.settings.datasource_id, filters, $scope.config);
			}
		};

		$scope.$watch('config.settings.selected.categories', function(categories) {
			Series.getSeries($scope.config, $scope.config.settings.table, []);
		    $scope.$broadcast('highchartsng.reflow');
		});

		$scope.$watch('config.settings.selected.values', function(values) {
			Series.getSeries($scope.config, $scope.config.settings.table, []);
		    $scope.$broadcast('highchartsng.reflow');
		});

		$scope.$watch('config.settings.selected.subcategories', function(values) {
			Series.getSeries($scope.config, $scope.config.settings.table, []);
		    $scope.$broadcast('highchartsng.reflow');
		});

		$scope.$watch('config.settings.datasource_id', function(datasource_id) {
			getDatasource(datasource_id);
		});

		$timeout(function() {
			$scope.$broadcast('highchartsng.reflow')
		}, 100);
	}

	function hcHighchartsLink(scope, element, attrs, fn) {
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



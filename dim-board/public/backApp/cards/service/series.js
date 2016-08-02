(function(){
'use strict';

angular
	.module('cards')
	.factory('Series', Series);

	Series.$inject = ['$http'];

	/**
	 * @name Series
	 * @desc API for cards
	 * @memberOf cards
	 */
	function Series($http) {
		var Series = {};

		Series.getSeries = function(chartConfig, table, filters) {
            var chartData = {};
            if (chartConfig.settings.chart.type === 'scatter' || chartConfig.settings.chart.type === 'bubble') {
                chartData = Series.scatterBubSeries(chartConfig.settings, table, filters);
            } else if ((!chartConfig.settings.drilldown || !chartConfig.settings.chart.drilldown) && chartConfig.settings.chart.showSubcat && chartConfig.settings.selected.subcategories && chartConfig.settings.selected.subcategories.key) {
                chartData = Series.groupSeries(chartConfig.settings, table, filters);
            } else if (chartConfig.settings.drilldown && chartConfig.settings.chart.drilldown && chartConfig.settings.selected.subcategories && chartConfig.settings.selected.subcategories.key) {
                chartData = Series.drilldownSeries(chartConfig.settings, table, filters);
            } else {
                chartData = Series.commonSeries(chartConfig.settings, table, filters);
            }
            if (chartData.drilldown) {
                chartConfig.chart.series = chartData.series;
                chartConfig.chart.options.drilldown = chartData.drilldown;
                chartConfig.chart.options.xAxis.categories = null;
                chartConfig.chart.options.xAxis.type = chartData.xAxis.type;
            } else if (chartData.series) {
                chartConfig.chart.series = chartData.series;
                chartConfig.chart.options.xAxis.categories = chartData.xAxis.categories;
            }
        };

        // commonSeries
        // series: [{
        //     name: 'Unique users',
        //     data: [
        //         ['Website visits', 15654],
        //         ['Downloads', 4064],
        //         ['Requested price list', 1987],
        //         ['Invoice sent', 976],
        //         ['Finalized', 846]
        //     ]
        // }]
        Series.commonSeries = function(chartConfigSettings, table, filters) {
            var category = chartConfigSettings.selected.categories;
            var value = chartConfigSettings.selected.values;

            if (category && value) {
                var series = [];
                var seriesData = [];
                var rows = table.rows;
                var xAxis = {
                    categories: []
                };

                if (chartConfigSettings.mergeData) {
                    rows = mergeDuplicateData(category, value, table.rows);
                }

                rows = filterRows(filters, rows);

                _.each(rows, function(row) {
                    xAxis.categories.push(row[category.key]);
                    seriesData.push([row[category.key], parseFloat(row[value.key])]);
                });

                series = [{
                    name: value.name,
                    data: seriesData
                }];

                if (chartConfigSettings.chart.type === 'waterfall') {
                    series.upColor = Highcharts.getOptions().colors[2],
                    series.color = Highcharts.getOptions().colors[3]
                }

                if (chartConfigSettings.chart.displaySeriesType) {
                    series[0].type = chartConfigSettings.chart.type;
                }

                if (chartConfigSettings.chart.semiCircle) {
                    series[0].innerSize = '50%';
                }
            }

            return {
                series: series || null,
                xAxis: xAxis || null
            };
        };

        // groupSeries
        // series: [{
        //     name: 'John',
        //     data: [5, 3, 4, 7, 2]
        // }, {
        //     name: 'Jane',
        //     data: [2, 2, 3, 2, 1]
        // }, {
        //     name: 'Joe',
        //     data: [3, 4, 4, 2, 5]
        // }]
        Series.groupSeries = function(chartConfigSettings, table, filters) {
            var category = chartConfigSettings.selected.categories;
            var subcategory = chartConfigSettings.selected.subcategories;
            var value = chartConfigSettings.selected.values;

            if (category && subcategory && value) {
                var subcatKey = subcategory.key;
                var subcats = [];
                var series = [];
                var rows = table.rows;
                var xAxis = {
                    categories: []
                };

                rows = filterRows(filters, rows);

                _.each(rows, function(row) {
                    if (!_.contains(subcats, row[subcatKey])) {
                        subcats.push(row[subcatKey]);
                    }
                });

                _.each(subcats, function(group) {

                    var seriesData = {
                        name: group,
                        data: []
                    };

                    _.each(rows, function(row) {
                        if (row[subcatKey] === group) {

                            if (row[value.key] === "") {
                                row[value.key] = null
                                seriesData.data.push(parseFloat(row[value.key]));
                            } else {
                                seriesData.data.push(parseFloat(row[value.key]));
                            }

                            if (!_.contains(xAxis.categories, row[category.key])) {
                                xAxis.categories.push(row[category.key]);
                            }
                        }
                    });

                    series.push(seriesData);
                });

            }

            return {
                series: series || null,
                xAxis: xAxis || null
            };
        };

        // drilldownSeries
        // series: [{
        //     name: 'Things',
        //     colorByPoint: true,
        //     data: [{
        //         name: 'Animals',
        //         y: 5,
        //         drilldown: 'animals'
        //     }, {
        //         name: 'Fruits',
        //         y: 2,
        //         drilldown: 'fruits'
        //     }, {
        //         name: 'Cars',
        //         y: 4,
        //         drilldown: 'cars'
        //     }]
        // }],
        // drilldown: {
        //     series: [{
        //         id: 'animals',
        //         data: [
        //             ['Cats', 4],
        //             ['Dogs', 2],
        //             ['Cows', 1],
        //             ['Sheep', 2],
        //             ['Pigs', 1]
        //         ]
        //     }, {
        //         id: 'fruits',
        //         data: [
        //             ['Apples', 4],
        //             ['Oranges', 2]
        //         ]
        //     }, {
        //         id: 'cars',
        //         data: [
        //             ['Toyota', 4],
        //             ['Opel', 2],
        //             ['Volkswagen', 2]
        //         ]
        //     }]
        // }
        Series.drilldownSeries = function(chartConfigSettings, table, filters) {
            var category = chartConfigSettings.selected.categories;
            var subcategory = chartConfigSettings.selected.subcategories;
            var value = chartConfigSettings.selected.values;

            if (category && subcategory && value) {
                var series = [];
                var seriesData = [];
                var drilldown = {
                    series: []
                };
                var rows = table.rows;
                var xAxis = {
                    type: 'category'
                };

                rows = filterRows(filters, rows);

                _.each(rows, function(row) {
                    // seriesData
                    var cat = _.findWhere(seriesData, {
                        name: row[category.key]
                    });
                    if (!cat) {
                        seriesData.push({
                            name: row[category.key].replace(/ /g, ''),
                            y: parseFloat(row[value.key]),
                            drilldown: row[category.key].toLowerCase().replace(/ /g, '')
                        });
                    } else {
                        cat.y = cat.y + parseFloat(row[value.key]);
                    }

                    // drilldown
                    var drill = _.findWhere(drilldown.series, {
                        id: row[category.key].toLowerCase().replace(/ /g, '')
                    });
                    if (!drill) {
                        drilldown.series.push({
                            id: row[category.key].toLowerCase().replace(/ /g, ''),
                            name: row[category.key],
                            data: [
                                [row[subcategory.key].replace(/ /g, ''), parseFloat(row[value.key])]
                            ],
                        });
                    } else {
                        drill.data.push([row[subcategory.key].replace(/ /g, ''), parseFloat(row[value.key])]);
                    }
                });

                series = [{
                    type: chartConfigSettings.chart.type,
                    name: category.name,
                    colorByPoint: true,
                    data: seriesData
                }];

                if (chartConfigSettings.chart.semiCircle) {
                    series[0].innerSize = '50%';
                }
            }

            return {
                series: series || null,
                drilldown: drilldown || null,
                xAxis: xAxis || null
            };
        };

        // scatterBubSeries
        // series: [{
        //     name: 'Female',
        //     data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6]]
        // },
        // {
        //     name: 'Male',
        //     data: [[161.2, 51.6], [167.5, 59.0], [159.5, 49.2], [157.0, 63.0], [155.8, 53.6]]
        // }]
        Series.scatterBubSeries = function(chartConfigSettings, table, filters) {
            var category = chartConfigSettings.selected.categories[0];
            var values = chartConfigSettings.selected.values;

            if (category && values.length > 1) {
                var categoryKey = category.key;
                var categories = [];
                var series = [];
                var rows = table.rows;
                var xAxis = {
                    categories: []
                };

                rows = filterRows(filters, rows);

                _.each(rows, function(row) {
                    if (!_.contains(categories, row[categoryKey])) {
                        categories.push(row[categoryKey]);
                    }
                });

                _.each(categories, function(category) {

                    var seriesData = {
                        name: category,
                        data: []
                    };

                    _.each(rows, function(row) {
                        if (row[categoryKey] === category) {

                            var rowValues = [];
                            _.each(values, function(value) {
                                if (row[value.key] === "") {
                                    row[value.key] = null
                                    rowValues.push(parseFloat(row[value.key]));
                                } else {
                                    rowValues.push(parseFloat(row[value.key]));
                                }
                            });

                            seriesData.data.push(rowValues);

                            if (!_.contains(xAxis.categories, row[categoryKey])) {
                                xAxis.categories.push(row[categoryKey]);
                            }
                        }
                    });

                    series.push(seriesData);
                });

            }

            return {
                series: series || null,
                xAxis: xAxis || null
            };
        };

        // populateheatmapSeries
        // series: [{
        //      name: '',
        //      borderWidth: 1,
        //      data: [[0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67], [1, 0, 92], [1, 1, 58]],
        //      dataLabels: {
        //          enabled: true
        //      }
        // }]
        // DOES NOT WORK CORRECTLY -- NEEDS TO BE DONE
        Series.populateHeatmapSeries = function(chartConfigSettings, table, filters) {
            var group = chartConfigSettings.selected.groups[0];
            var categories = chartConfigSettings.selected.categories;
            var values = chartConfigSettings.selected.values;

            if (value && category) {
                var seriesData = [];
                var xAxis = {
                    categories: []
                };

                var groupColumnObjects = [];

                _.each(table.rows[0], function(cat) {
                    groupColumnObjects.push(cat);
                });

                _.each(categories, function(category) {
                    xAxis.categories.push(data[category.key]);
                    _.each(values, function(value) {
                        var r = 0;
                        _.each(groupColumnObjects, function(data) {
                            var c = 0;
                            _.each(table.rows, function(cat) {
                                seriesData.push([c, r, parseFloat(cat[value.key])]);
                                c++;
                            });
                            r++;
                        });
                    });
                });

                var series = [{
                    borderWidth: 1,
                    type: chartConfigSettings.chart.type,
                    name: value.name,
                    data: seriesData,
                    dataLabels: {
                        enabled: true
                    }
                }];
            }

            return {
                series: series || null,
                xAxis: xAxis || null
            };
        };

        function mergeDuplicateData(category, value, rows) {
            var values = [];
            var filteredRows = [];
            _.each(rows, function(row) {
                if (_.indexOf(values, row[category.key]) === -1) {
                    values.push(row[category.key]);
                    var duplicates = _.where(rows, _.object([category.key], [row[category.key]]));
                    if (duplicates.length > 1) {
                        var mergeValues = 0;
                        _.each(duplicates, function(duplicate) {
                            mergeValues += parseFloat(duplicate[value.key]);
                        });
                        var newRow = {};
                        $.extend(newRow, row);
                        newRow[value.key] = mergeValues;
                        filteredRows.push(newRow);
                    } else {
                        filteredRows.push(row);
                    }
                }
            });

            return filteredRows;
        }

        function filterRows(filters, rows) {
          var filteredRows = angular.copy(rows);

          _.each(filters, function(filter) {
            console.log(filter);
              var tmpResult = [];
              _.each(filter.options, function(option) {
                  if(option.selected === true) {
                      _.each(filteredRows, function (row) {
                          if(row[filter.key] === option.name) {
                              tmpResult.push(row);
                          }
                      });
                  }
              });
              if(tmpResult.length > 0) {
                  filteredRows = tmpResult;
              }
          });

          return filteredRows;
        }

		return Series;
	}
})();
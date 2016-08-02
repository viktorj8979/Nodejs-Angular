(function(){
'use strict';

angular
	.module('cards')
	.factory('Charts', Charts);

	Charts.$inject = ['$http'];

	/**
	 * @name Charts
	 * @desc API for charts
	 * @memberOf cards
	 */
	function Charts($http) {
		var Charts = {};

		Charts.pie = function() {
			var pieChart = {
                type: 'highchart',
                datax: 0,
                datay: 0,
                style: {
                    'width': '134px',
                    'height': '128px'
                },
                settings: {
                    chart: {
                        type: 'pie',
                        displaySeriesType: true,
                        drilldown: true,
                        showSubcat: true
                    },
                    datasource_id: null,
                    table: {
                      columns: [],
                      rows: []
                    },
                    selected: {
                      chooseData: true,
                      filters: [],
                      categories: {},
                      subcategories: {},
                      values: {},
                      theme: {},
                      table: {
                        columns: [],
                        globalSearch: true,
                        pagination: true,
                        rowStriped: true,
                        rowHover: true,
                        rowSelect: true,
                        gridline: true,
                        enableBottomBorder: true,
                        textAlignment: 'left',
                        columnWidth:'100',
                        columnWidthUnit:'%'
                      }
                    },
                    mergeData: true,
                    drilldown: true
                },
                chart: {
                    options: {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: false,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                                    style: {
                                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                                    }
                                }
                            }
                        },
                        xAxis: {
				            categories: [],
				            title: {
				                text: null
				            }
				        }
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    series: [{
                        name: "Brands",
                        colorByPoint: true,
                        data: [{
                            name: "Microsoft Internet Explorer",
                            y: 56.33
                        }, {
                            name: "Chrome",
                            y: 24.03,
                            sliced: true,
                            selected: true
                        }, {
                            name: "Firefox",
                            y: 10.38
                        }, {
                            name: "Safari",
                            y: 4.77
                        }, {
                            name: "Opera",
                            y: 0.91
                        }, {
                            name: "Proprietary or Undetectable",
                            y: 0.2
                        }]
                    }]
                },
                html: '<hc-highcharts class="card-option-selected"></hc-highcharts>'
            };

			return pieChart;
		};

		Charts.bar = function() {
			var barChart = {
                type: 'highchart',
                datax: 0,
                datay: 0,
                style: {
                    'width': '134px',
                    'height': '128px'
                },
                settings: {
                    chart: {
                        type: 'bar',
                        displaySeriesType: true,
                        drilldown: true,
                        showSubcat: true
                    },
                    datasource_id: null,
                    table: {
                      columns: [],
                      rows: []
                    },
                    selected: {
                      chooseData: true,
                      filters: [],
                      categories: {},
                      subcategories: {},
                      values: {},
                      theme: {},
                      table: {
                        columns: [],
                        globalSearch: true,
                        pagination: true,
                        rowStriped: true,
                        rowHover: true,
                        rowSelect: true,
                        gridline: true,
                        enableBottomBorder: true,
                        textAlignment: 'left',
                        columnWidth:'100',
                        columnWidthUnit:'%'
                      }
                    },
                    mergeData: true,
                    drilldown: false
                },
                chart: {
                    options: {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'bar'
                        },
                        xAxis: {
				            categories: ['Africa', 'America', 'Asia', 'Europe', 'Oceania'],
				            title: {
				                text: null
				            }
				        },
				        yAxis: {
				            min: 0,
				            title: {
				                text: '',
				                align: 'high'
				            },
				            labels: {
				                overflow: 'justify'
				            }
				        },
                        tooltip: {
				            valueSuffix: ''
				        },
				        plotOptions: {
				            bar: {
				                dataLabels: {
				                    enabled: true
				                }
				            }
				        },
				        credits: {
				            enabled: false
				        },
                    },
                    title: {
                        text: ''
                    },
                    subtitle: {
                        text: ''
                    },
                    series: [{
			            name: 'Year 1800',
			            data: [107, 31, 635, 203, 2]
			        }, {
			            name: 'Year 1900',
			            data: [133, 156, 947, 408, 6]
			        }, {
			            name: 'Year 2012',
			            data: [1052, 954, 4250, 740, 38]
			        }]
                },
                html: '<hc-highcharts class="card-option-selected"></hc-highcharts>'
            };

			return barChart;
		};


		return Charts;
	}

})();
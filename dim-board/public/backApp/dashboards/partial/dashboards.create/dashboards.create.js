(function(){

'use strict';

/**
 * DashboardsCreateCtrl Controllers
 * @namespace Controllers
 */

angular.module('dashboards')
    .controller('DashboardsCreateCtrl', DashboardsCreateCtrl);

DashboardsCreateCtrl.$inject = ['$stateParams', '$scope', '$http', '$timeout', '$compile','$modal', 'Dashboards', 'auth', 'SweetAlert', 'Themes'];

function DashboardsCreateCtrl($stateParams, $scope, $http, $timeout, $compile,$modal, Dashboards, auth, SweetAlert, Themes) {
    /** Authenticated user profile. */
    $scope.auth = auth;
    /** Initialize dashboard object. */
    $scope.dashboard = {};
    /** Gridster Options */
    $scope.gridsterOpts = {};
    /** Selected card. */
    $scope.selectedCard = {};
    /** Select a card. */
    $scope.selectCard = selectCard;
    /** Add a comment. */
    $scope.addComment = addComment;
    /** Add a card. */
    $scope.addCard = addCard;
    /** Copy a card. */
    $scope.copyCard = copyCard;
    /** Delete a card. */
    $scope.deleteCard = deleteCard;
    /** Save dashboard. */
    $scope.saveDashboard = saveDashboard;
    /** Delete dashboard. */
    $scope.deleteDashboard = deleteDashboard;
    /** Themes */
    $scope.themes = [];
    /** new Theme. */
    $scope.applyTheme = applyTheme;

    $scope.opencardSettings = ''; //opencardSettings;
    $scope.addText = '';//addText;
    $scope.editText = '';//editText;

    $scope.openedCardMenu = false; // opened Card Menu flag
    $scope.openedSettingMenu = false; // opened Setting Menu flag

    $scope.closeCardMenuAndOpenSettingMenu = closeCardMenuAndOpenSettingMenu; // close Card Menu And Open Setting Menu
    $scope.closeSettingMenuAndOpenCardMenu = closeSettingMenuAndOpenCardMenu; // close Setting Menu And Open Card Menu

    getThemes();

    function init() {
        if($stateParams.id){
            getDashboard($stateParams.id);
        } else { 
            createDashboard();
        }
        setGridsterOptions();
    }

    function closeCardMenuAndOpenSettingMenu(){
      $scope.openedSettingMenu = true;
      $scope.openedCardMenu = false;
    }

    function closeSettingMenuAndOpenCardMenu(){
      $scope.openedSettingMenu = false;
      $scope.openedCardMenu = true;
    }

    function getThemes() {
        Themes
            .getThemesByGroupId($scope.$parent.selectedGroup._id)
            .then(success, error);

        function success(themes) {
            if(themes) {
                $scope.themes = themes.sort(function(obj){
                    if(obj.core_theme === "false"){
                      return 10;
                    } else {
                     return 0;
                    }
                });

                init();
            }
        }

        function error(response) {
            console.log(response);
        }
    }

    function applyTheme(theme, newTheme) {
        if(newTheme && theme && newTheme.data && theme.data){
          var res = {
            'background-color' : newTheme.data.background_color || theme.data.background_color,
            'color' : newTheme.data.color || theme.data.color,
            'background-image' : (newTheme.data.background_image || theme.data.background_image)?'url(' + newTheme.data.background_image || theme.data.background_image + ')':'',
            'border-style': newTheme.data.border_style || theme.data.border_style,
            'border-width': newTheme.data.border_width || theme.data.border_width,
            'border-color': newTheme.data.border_color || theme.data.border_color,
            'border-style': 'solid'
            };
            return res;
        } else if(theme && theme.data){
          var res = {
            'background-color' : theme.data.background_color,
            'color' : theme.data.color,
            'background-image' : theme.data.background_image?'url(' + theme.data.background_image + ')':'',
            'border-style': theme.data.border_style,
            'border-width': theme.data.border_width,
            'border-color': theme.data.border_color,
            'border-style': 'solid'
           };
           return res;
        }
    };

    function setGridsterOptions() {
        $scope.gridsterOpts = {
            columns: 24, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square cards.
            margins: [55, 10], // the pixel distance between each card
            outerMargin: false, // whether margins apply to outer edges of the grid
            isMobile: false, // stacks the grid items if true
            mobileBreakPoint: 600, // if the screen is not wider that this, remove the grid layout and stack the items
            mobileModeEnabled: true, // whether or not to toggle mobile mode when screen width is less than mobileBreakPoint
            minColumns: 1, // the minimum columns the grid must have
            minRows: 2, // the minimum height of the grid, in rows
            maxRows: 100,
            defaultSizeX: 2, // the default width of a gridster item, if not specifed
            defaultSizeY: 1, // the default height of a gridster item, if not specified
            minSizeX: 1, // minimum column width of an item
            maxSizeX: null, // maximum column width of an item
            minSizeY: 1, // minumum row height of an item
            maxSizeY: null, // maximum row height of an item
            resizable: {
               enabled: true,
               handles: ['n', 'e', 's', 'w', 'ne', 'se', 'sw', 'nw'],
               start: function(event, $element, card) {
                    $scope.$broadcast('highchartsng.reflow');
               }, // optional callback fired when resize is started,
               resize: function(event, $element, card) {
                    $scope.$broadcast('highchartsng.reflow');
               }, // optional callback fired when item is resized,
               stop: function(event, $element, card) {
                    $timeout(function() {
                        $scope.$broadcast('highchartsng.reflow')
                    }, 300);
               } // optional callback fired when item is finished resizing
            },
            draggable: {
               enabled: true, // whether dragging items is supported
               handle: '.my-class', // optional selector for resize handle
               start: function(event, $element, card) {}, // optional callback fired when drag is started,
               drag: function(event, $element, card) {}, // optional callback fired when item is moved,
               stop: function(event, $element, card) {} // optional callback fired when item is finished dragging
            }
        }
    }

    function createDashboard() {
        $scope.dashboard = {
            title: 'New Dashboard',
            description: '',
            groups: [
                {
                  _id: $scope.$parent.selectedGroup._id,
                  permission_id: 0
                }
            ],
            thumb_url: "/backApp/assets/img/dashboard/dashboard2.jpg",
            cards: [],
            settings: {
                showCardFooters: true,
                showMembers: true,
                theme: findThemeById($scope.$parent.selectedGroup.settings.themes.dashboard),
                cardsTheme: findThemeById($scope.$parent.selectedGroup.settings.themes.card)
            }
        };
    }

    function addComment(card) {
        if (this.comment.length > 0) {
            var comment = {
                user: {
                    _id: '55cb495bde32e8101602c976',
                    name: 'Emily Johnson',
                    picture: '../backApp/assets/img/profiles/5x.jpg'                           
                },
                message: this.comment

            };
            card.comments.push(comment);
            this.comment = '';
        }
    }

    function selectCard(card) {
        $scope.selectedCard = card;
    }

    function copyCard(card) {
        var cardCopy = $.extend({}, card);
        delete cardCopy.$$hashKey;
        $scope.dashboard.cards.push(cardCopy);
    }

    function deleteCard(card) {
        $scope.dashboard.cards.splice($scope.dashboard.cards.indexOf(card), 1);
    }

    function addCard(card) {
        var cardCopy = $.extend({}, card);
        delete cardCopy.$$hashKey;
        $scope.dashboard.cards.push(cardCopy);
        stopProgress();
    }

    function findThemeById(id){
        for (var i = 0; i < $scope.themes.length; i++) {
            if($scope.themes[i]._id === id){
                return $scope.themes[i];
            }
        };
        return false;
    }

    function getDashboard(id) {
        Dashboards
            .getDashboard(id)
            .then(success, error);

        function success(dashboard) {
            if(dashboard) {
                $scope.dashboard = dashboard;
                if(!$scope.dashboard.settings.theme){
                  $scope.dashboard.settings.theme = findThemeById($scope.$parent.selectedGroup.settings.themes.dashboard);
                }
                if(!$scope.dashboard.settings.cardsTheme){
                  $scope.dashboard.settings.theme = findThemeById($scope.$parent.selectedGroup.settings.themes.card);
                }
                stopProgress();
            } else {
            	createDashboard();
            }
        }

        function error(response) {
            // getDashboard error
        }
    }

    function saveDashboard() {
        if($scope.dashboard._id) {
            Dashboards
                .updateDashboard($scope.dashboard)
                .then(success, error);
        } else {
            Dashboards
                .saveDashboard($scope.dashboard)
                .then(success, error);
        }

        function success(response) {
            SweetAlert.swal("Saved!", "Your dashboard has been saved.", "success"); 
            $scope.$parent.getDashboards();
        }

        function error(response) {
            SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
        }
    }

    function deleteDashboard() {
        SweetAlert.swal({
           title: "Are you sure?",
           text: "You will not be able to recover this dashboard!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
           cancelButtonText: "No, cancel please!",
           closeOnConfirm: false,
           closeOnCancel: false }, 
        function(isConfirm){ 
           if (isConfirm) {
                Dashboards
                    .deleteDashboard($scope.dashboard._id)
                    .then(success, error);
           } else {
              SweetAlert.swal("Cancelled", "Your dashboard is safe :)", "error");
           }
        });

        function success(response) {
            SweetAlert.swal("Deleted!", "Your dashboard has been deleted.", "success"); 
        }

        function error(response) {
            SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
        }
    }

    /**
     * [linkCharts description]
     * @method linkCharts
     * @param  {[type]}   $event [description]
     * @param  {[type]}   chart  [description]
     * @return {[type]}          [description]
     */
    $scope.linkCharts = function($event, chart) {
      $event.preventDefault();
      var linkedCharts = {
        numCharts: 0,
        linked: 0,
        linkedColor: '',
        filters: []
      };
      var filterColors = ['#77DAE2', '#77E277', '#FF7A7A', '#FFBB47', '#FFBB47'];

      _.each($scope.dashboard.cards, function(card) {
        if (card.settings.datasource_id == chart.settings.datasource_id) {
          linkedCharts.numCharts += 1;
          if (card.linked) {
            linkedCharts.linked += 1;
            linkedCharts.linkedColor = card.linkedColor;
            linkedCharts.filters = card.filters;
          }
        } else if (card.linked) {
          filterColors = _.without(filterColors, card.linkedColor);
        }
      });

      if (linkedCharts.linked === 0) {
        linkAllCharts(chart);
      } else if (linkedCharts.linked === 1) {
        unLinkAllCharts(chart);
      } else if (chart.linked) {
        chart.linked = false;
        chart.linkedColor = '';
        chart.filters = [];
      } else {
        chart.linked = true;
        chart.linkedColor = linkedCharts.linkedColor;
        chart.filters = linkedCharts.filters;
      }

      function linkAllCharts(chart) {
        var color = filterColors[Math.floor(Math.random() * filterColors.length)];
        _.each($scope.dashboard.cards, function(card) {
          if (card.config && option.settings.datasource_id == chart.settings.datasource_id) {
            card.linked = true;
            card.linkedColor = color;
            card.filters = linkedCharts.filters;
          }
        });
      }

      function unLinkAllCharts(chart) {
        _.each($scope.dashboard.cards, function(card) {
          if (card.config && option.settings.datasource_id == chart.settings.datasource_id) {
            card.linked = false;
            card.linkedColor = '';
            card.filters = [];
          }
        });
      }
    };

    /**
     * [filterCharts description]
     * @method linkCharts
     * @param  {[type]}   $event [description]
     * @param  {[type]}   chart  [description]
     * @return {[type]}          [description]
     */
    $scope.filterCharts = function(datasource_id, filters, chart) {
      _.each($scope.dashboard.cards, function(card) {
        if (card.settings.datasource_id == chart.datasource_id) {
          if (card.linked && (card !== chart)) {
            card.filters = filters;
          }
        }
      });
    }

        

        function stopProgress() {
            $timeout(function() {
               $('body').find('.progress').removeClass('progress');
            }, 30);
        }
        
        $scope.refreshTest = function(portlet) {
            console.log("Refreshing...");
            // Timeout to simulate AJAX response delay
            $timeout(function() {
                $(portlet).portlet({
                    refresh: false
                });
            }, 2000);

        }

        // Manually Destroy Livecard objects
        // $scope.$on('$destroy', function() {
        //     $('.live-card').livecard("destroy");
        // });
}

angular.module('dim')
    .directive('card5Chart', ['$timeout', function($timeout) {
        return {
            restrict: 'C',
            link: function(scope, el, attrs) {
                $timeout(function() {
                    var container = '.card-5-chart';

                    var seriesData = [
                        [],
                        []
                    ];
                    var random = new Rickshaw.Fixtures.RandomData(7);
                    for (var i = 0; i < 7; i++) {
                        random.addData(seriesData);
                    }

                    var graph = new Rickshaw.Graph({
                        element: document.querySelector(container),
                        renderer: 'bar',
                        series: [{
                            data: [{
                                x: 0,
                                y: 10
                            }, {
                                x: 1,
                                y: 8
                            }, {
                                x: 2,
                                y: 5
                            }, {
                                x: 3,
                                y: 9
                            }, {
                                x: 4,
                                y: 5
                            }, {
                                x: 5,
                                y: 8
                            }, {
                                x: 6,
                                y: 10
                            }],
                            color: $.Pages.getColor('danger')
                        }, {
                            data: [{
                                x: 0,
                                y: 0
                            }, {
                                x: 1,
                                y: 2
                            }, {
                                x: 2,
                                y: 5
                            }, {
                                x: 3,
                                y: 1
                            }, {
                                x: 4,
                                y: 5
                            }, {
                                x: 5,
                                y: 2
                            }, {
                                x: 6,
                                y: 0
                            }],
                            color: $.Pages.getColor('master-light')
                        }]

                    });

                    var MonthBarsRenderer = Rickshaw.Class.create(Rickshaw.Graph.Renderer.Bar, {
                        barWidth: function(series) {

                            return 7;
                        }
                    });

                    graph.setRenderer(MonthBarsRenderer);

                    graph.render();

                    $(window).resize(function() {
                        graph.configure({
                            width: $(container).width(),
                            height: $(container).height()
                        });

                        graph.render()
                    });

                    $(container).data('chart', graph);
                }, 200);
                
            }
        };
    }]);

})();
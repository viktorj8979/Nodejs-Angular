(function(){

'use strict';

/**
 * CardsCreateCtrl Controllers
 * @namespace Controllers
 */

angular.module('cards')
    .controller('CardsCreateCtrl', CardsCreateCtrl);

CardsCreateCtrl.$inject = ['$stateParams', '$scope', '$http', '$timeout', '$compile','$modal', 'Cards', 'auth', 'SweetAlert', 'Series', 'cardOptions', 'Charts', 'Card'];

function CardsCreateCtrl($stateParams, $scope, $http, $timeout, $compile, $modal, Cards, auth, SweetAlert, Series, cardOptions, Charts, Card) {
    /** Authenticated user profile. */
    $scope.auth = auth;
    /** Gridster Options */
    $scope.gridsterOpts = {};
    /** Init card. */
    $scope.card = null;
    /** Init card. */
    $scope.cardOptions = cardOptions;
    /** Select card options. */
    $scope.selectCardOption = selectCardOption;
    /** Selected card option. */
    $scope.cardOptionSelected = {};
    /** open card option settings */
    $scope.openCardOptionSettings = false;
    /** Delete card. */
    $scope.deleteCard = deleteCard;
    /** Save card. */
    $scope.saveCard = saveCard;

    /** Init data */
    $scope.data = {};
    /** Init categories */
    $scope.data.categories = [];
    /** Init values */
    $scope.data.values = [];
    /** Init values */
    $scope.data.columns = [];

    /** Current step */
    $scope.activeStep = 'charts';
    /** Enabled step */
    $scope.enableStep = enableStep;


    $scope.opencardSettings = '';//opencardSettings;
    $scope.addChartOption = addChartOption;
    $scope.addDataOptions = addDataOptions;


    init();

    function init() {
        Card.cardOptions = [];
        if($stateParams.id){
            getCard($stateParams.id);
        } else {
            $scope.card = Card;
        }
        setGridsterOptions();
        //initCardOptionSelected();
        stopProgress();
        //initCardOptionDropZone();
    }

    function enableStep(step) {
        if (step === 'charts') {
            $scope.activeStep = 'charts';
        }
        if (step === 'data-options') {
            $scope.activeStep = 'data-options';
        }
        if (step === 'filters') {
            $scope.activeStep = 'filters';
        }

        if(step === 'data') {
            if($scope.card.cardOptions.length > 0) {
                $scope.activeStep = 'data';
            }
        }
        if(step === 'style') {
           if($scope.card.cardOptions.length > 0 && $scope.card.datasources.length > 0) {
                $scope.activeStep = 'style';
            }
        }
    }

    function selectCardOption(option) {
        $scope.cardOptionSelected = option;
        $scope.openCardOptionSettings = true;
        $scope.activeStep = 'data';
    }

    /**
     * @name refreshDatasources
     * @desc Get updated data for datasources.
     * @params {{Oject}} datasource, the datasource object.
     */
     function refreshDatasources() {
        angular.forEach($scope.card.datasources, function(datasource) {
            getData(datasource);
        });
     }

    /**
     * @name getData
     * @desc Get data from datasource.
     * @params {{Oject}} datasource, the datasource object.
     */
    function getData(datasource) {
        Datasources
            .S3.getFileData(datasource, function(err, data) {
                if (data) {
                    datasource.data = d3.csv.parse(data.Body.toString());
                    datasource.table = {};
                    datasource.table.columns = Datasources.formatColumnData(datasource.data, datasource_id);
                    datasource.table.rows = Datasources.formatRowData(datasource.data, datasource_id);
                    $scope.addDataOptions(datasource);
                    $scope.$apply();
                }
            });
    }

    function addDataOptions(datasource) {
        $scope.data.categories = $.merge(onlyTextValues(datasource.table.columns), $scope.data.categories);
        $scope.data.values = $.merge(onlyNumericValues(datasource.table.columns), $scope.data.values);
    }

    function onlyNumericValues(columns) {
        return _.filter(columns, function(column){ return column.numeric; });
    }

    function onlyTextValues(columns) {
        return _.filter(columns, function(column){ return !column.numeric; });
    }

    function initCardOptionSelected() {
        // target elements with the "draggable" class
        interact('.card-option-selected')
          .draggable({
            // enable inertial throwing
            inertia: true,
            maxPerElement: 3,
            // keep the element within the area of it's parent
            restrict: {
              restriction: 'parent',
              endOnly: true,
              elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
            },

            // call this function on every dragmove event
            onmove: dragMoveCardOption,
            // call this function on every dragend event
            onend: function (event) {
              $scope.$broadcast('highchartsng.reflow');
            }
          })
          .resizable({
            edges: { left: true, right: true, bottom: true, top: true }
          })
          .on('resizemove', function (event) {
            var target = event.target,
                x = (parseFloat(target.getAttribute('data-x')) || 0),
                y = (parseFloat(target.getAttribute('data-y')) || 0);

            // update the element's style
            target.style.width  = event.rect.width + 'px';
            target.style.height = event.rect.height + 'px';

            // translate when resizing from top or left edges
            x += event.deltaRect.left;
            y += event.deltaRect.top;

            target.style.webkitTransform = target.style.transform =
                'translate(' + x + 'px,' + y + 'px)';

            //$scope.cardOptionSelected.style.transform = target.style.transform;

            // $scope.cardOptionSelected.datax = x;
            // $scope.cardOptionSelected.datay = y;
            target.setAttribute('data-x', x);
            target.setAttribute('data-y', y);
            $scope.$broadcast('highchartsng.reflow');
          });
    }

    function dragMoveCardOption (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        //$scope.cardOptionSelected.style.transform = target.style.transform;

        // update the posiion attributes
        // $scope.cardOptionSelected.datax = x;
        // $scope.cardOptionSelected.datay = y;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }
    window.dragMoveCardOption = dragMoveCardOption;

    function dragMoveListener (event) {
        var target = event.target,
            // keep the dragged position in the data-x/data-y attributes
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
          'translate(' + x + 'px, ' + y + 'px)';

        // update the posiion attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }

      // this is used later in the resizing demo
      window.dragMoveListener = dragMoveListener;

    function setGridsterOptions() {
        $scope.gridsterOpts = {
            columns: 8, // the width of the grid, in columns
            pushing: true, // whether to push other items out of the way on move or resize
            floating: true, // whether to automatically float items up so they stack (you can temporarily disable if you are adding unsorted items with ng-repeat)
            swapping: false, // whether or not to have items of the same size switch places instead of pushing down if they are the same size
            width: 'auto', // can be an integer or 'auto'. 'auto' scales gridster to be the full width of its containing element
            colWidth: 'auto', // can be an integer or 'auto'.  'auto' uses the pixel width of the element divided by 'columns'
            rowHeight: 'match', // can be an integer or 'match'.  Match uses the colWidth, giving you square widgets.
            margins: [55, 10], // the pixel distance between each widget
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
               start: function(event, $element, widget) {
                    $scope.$broadcast('highchartsng.reflow');
               }, // optional callback fired when resize is started,
               resize: function(event, $element, widget) {
                    $scope.$broadcast('highchartsng.reflow');
               }, // optional callback fired when item is resized,
               stop: function(event, $element, widget) {
                    $timeout(function() {
                        $scope.$broadcast('highchartsng.reflow')
                    }, 300);
               } // optional callback fired when item is finished resizing
            },
            draggable: {
               enabled: false, // whether dragging items is supported
               handle: '.my-class', // optional selector for resize handle
               start: function(event, $element, widget) {}, // optional callback fired when drag is started,
               drag: function(event, $element, widget) {}, // optional callback fired when item is moved,
               stop: function(event, $element, widget) {} // optional callback fired when item is finished dragging
            }
        }
    }

    function addChartOption(type) {
        var option = {};

        if(type === 'text') {
            option = {
                type: 'text',
                datax: 0,
                datay: 0,
                text: 'Text',
                style: {
                    'width': '134px',
                    'height': '128px'
                },
                html: '<hc-text class="card-option-selected"></hc-text>'
            };
        } else if(type === 'table') {
            option = {
                type: 'table',
                datax: 0,
                datay: 0,
                style: {
                    'width': '511px',
                    'height': '344px',
                    'transform': 'translate(0px, -75px)'
                },
                settings: {
                    loading: false,
                    chooseData: true,
                    chart: {
                        type: 'table'
                    },
                    datasource_id: null,
                    table: {
                      columns: [],
                      rows: []
                    },
                    selected: {
                      filters: [],
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
                html: '<hc-table class="card-option-selected"></hc-table>'
            };
        } else {
            option = Charts[type]();
        }

        var length = Card.cardOptions.push(option);
        var index = length - 1;
        
        //compileHtml(option, index);

        //initCardOptionSelected();
        selectCardOption(option);
    }

    // function compileHtml(option, index) {
    //     var html = angular.copy(option.html);
    //     html = angular.element(html);
    //     $(html).attr('config', "card.cardOptions['" + index + "']");
    //     //$(html).attr('ng-click', "selectCardOption(card.cardOptions['" + id + "'])");
    //     //$(html).attr('ng-style', "card.cardOptions['" + id + "'].style");
    //     //$(html).attr('data-x', "card.cardOptions['" + id + "'].datax");
    //     //$(html).attr('data-y', "card.cardOptions['" + id + "'].datay");
    //     $($compile(html)($scope)).appendTo( $('.card-container') );
    // }

    function getCard(id) {
        Cards
            .getCard(id)
            .then(success, error);

        function success(card) {
            if(card) {
                Card = card;
                $scope.card = Card;
                $scope.cardOptionSelected = Card.cardOptions[0];
            } else {
            	createCard();
                $scope.card = Card;
            }
        }

        function error(response) {
            // getDashboard error
        }
    }

    function saveCard() {
        if(Card._id) {
            Cards
                .updateCard(Card)
                .then(success, error);
        } else {
            Cards
                .saveCard(Card)
                .then(success, error);
        }

        function success(response) {
            SweetAlert.swal("Saved!", "Your dashboard has been saved.", "success"); 
            $scope.$parent.getCards();
        }

        function error(response) {
            SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
        }
    }

    function deleteCard() {
        SweetAlert.swal({
           title: "Are you sure?",
           text: "You will not be able to recover this card!",
           type: "warning",
           showCancelButton: true,
           confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
           cancelButtonText: "No, cancel please!",
           closeOnConfirm: false,
           closeOnCancel: false }, 
        function(isConfirm){ 
           if (isConfirm) {
                Cards
                    .deleteCard(Card._id)
                    .then(success, error);
           } else {
              SweetAlert.swal("Cancelled", "Your card is safe :)", "error");
           }
        });

        function success(response) {
            SweetAlert.swal("Deleted!", "Your card has been deleted.", "success"); 
        }

        function error(response) {
            SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
        }
    }

    /* loading data */
    function stopProgress() {
        $timeout(function() {
           $('body').find('.progress').removeClass('progress');
        }, 30);
    }
}

})();
(function() {
	'use strict';

	angular
	.module('cards')
	.directive('hcCard', hcCard)
    .directive('dynamic', dynamic);

	function hcCard() {
		var directive = {
			restrict: 'E',
			replace: true,
			scope: {
				cardConfig: '='
			},
			templateUrl: '../backApp/cards/directive/hc-card/hc-card.html',
			link: {
				pre: hcCardLink
			},
			controller: hcCardController
		};

		return directive;
	}

	hcCardController.$inject = ['$scope', '$state', '$timeout', '$compile', 'Card'];

	function hcCardController($scope, $state, $timeout, $compile, Card) {
		$scope.cardEdit = $state.current.name === 'cards.create';
		$scope.copyCard = $scope.$parent.copyCard;
		$scope.deleteCard = $scope.$parent.deleteCard;
		$scope.linkCharts = $scope.$parent.linkCharts;


		init();

		function init() {
		}

		function addOptions(cardOptions) {
            angular.forEach(cardOptions, function(option, index) {
                $timeout(function() {
                	compileHtml(option, index);
                }, 300);
            });
		}

		function compileHtml(option, index) {
	        var html = angular.copy(option.html);
	        html = angular.element(html);
	        $(html).attr('config', "cardConfig.cardOptions['" + index + "']");
	        //$(html).attr('ng-click', "selectCardOption(card.cardOptions['" + id + "'])");
	        //$(html).attr('ng-style', "card.cardOptions['" + id + "'].style");
	        //$(html).attr('data-x', "card.cardOptions['" + id + "'].datax");
	        //$(html).attr('data-y', "card.cardOptions['" + id + "'].datay");
	        $($compile(html)($scope)).appendTo( $($scope.element).find('.card-container') );
	    }

	    var first = true;
	    $scope.$watchCollection(function() {
	    	return $scope.$parent.card.cardOptions;
	    }, function(cardOptions) {
	    	if(first) {
	    		first = false;
	    		addOptions(cardOptions);
	    	} else {
	    		var option = $(cardOptions).last();
	    		addOptions(option);
	    	}
		});
	}

	function hcCardLink(scope, element, attrs, fn) {
		scope.element = element;
	}

	dynamic.$inject = ['$compile'];

	function dynamic($compile) {
	  return {
	    restrict: 'A',
	    replace: true,
	    link: function (scope, ele, attrs) {
	      scope.$watch(attrs.dynamic, function(html) {
	        ele.html(html);
	        $compile(ele.contents())(scope);
	      });
	    }
	  };
	}

})();
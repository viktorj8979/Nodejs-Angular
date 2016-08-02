angular
	.module('cards')
	.directive('hcText', hcText);

	function hcText() {
		var directive = {
			restrict: 'E',
			replace: true,
			scope: {
				config: '='
			},
			templateUrl: '../backApp/cards/directive/hc-text/hc-text.html',
			link: {
				pre: hcTextLink
			},
			controller: hcTextController
		};

		return directive;
	}

	hcTextController.$inject = ['$scope', 'Card', '$sce'];

	function hcTextController($scope, Card, $sce) {
		$scope.deleteOption = deleteOption;
		$scope.trustAsHtml = trustAsHtml;

		function trustAsHtml(string) {
		    return $sce.trustAsHtml(string);
		};

		function deleteOption() {
            delete Card.cardOptions[$scope.config._id];
            $('#' + $scope.config._id).remove();
            $scope.$destroy();
        }
	    
	}

	function hcTextLink(scope, element, attrs, fn) {
		scope.selectCardOption = scope.$parent.selectCardOption;
	}




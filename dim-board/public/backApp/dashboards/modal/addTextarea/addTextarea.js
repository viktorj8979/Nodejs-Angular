
(function(){
	'use strict';
	angular
		.module('dashboards')
		.controller('AddtextareaCtrl', AddtextareaCtrl);

		AddtextareaCtrl.$inject = ['$scope','$modalInstance','cards'];

		function AddtextareaCtrl($scope, $modalInstance, cards) {
			$scope.modalData = {};
			$scope.addText = addText;

			function addText() {
				cards.push({ 
					sizeX: 6,
					sizeY: 4,
					row: 0,
					col: 0 ,
					cardOptions:[
						{
							type: 'text',
							datax: 0,
							datay: 0,
							text: $scope.modalData.textarea,
							style: {
							    'width': '134px',
							    'height': '128px'
							},
							html: '<hc-text class="card-option-selected"></hc-text>'
						}
					]
				});
				$modalInstance.close();
			}
		}

})();
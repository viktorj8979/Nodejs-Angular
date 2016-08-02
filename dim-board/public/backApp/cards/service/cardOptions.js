(function(){
'use strict';

angular
	.module('cards')
	.factory('cardOptions', cardOptions);

	cardOptions.$inject = [];

	/**
	 * @name cardOptions
	 * @desc Options available to cards
	 * @memberOf cards
	 */
	function cardOptions() {
		var cardOptions = [
				{
					title: 'Text',
					image: '',
					innerText: 'ABC',
					type: 'text'
				},
				{
					title: 'Table',
					image: '../backApp/assets/icons/table-charts/table-76x76.png',
					innerText: '',
					type: 'table'
				},
				{
					title: 'Pie',
					image: '../backApp/assets/icons/pie-charts/pie-chart/pie-chart-76x76.png',
					innerText: '',
					type: 'pie'
				},
				{
					title: 'Bar',
					image: '../backApp/assets/icons/bar-charts/basic-bar/basic-bar-76x76.png',
					innerText: '',
					type: 'bar'
				}
			];

		return cardOptions;
	}

})();
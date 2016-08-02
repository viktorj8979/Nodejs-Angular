(function(){
'use strict';

angular
	.module('themes')
	.factory('Themes',Themes);

	Themes.$inject = ['$http'];

	/**
	 * @name themes
	 * @desc API for themes
	 * @memberOf themes
	 */
	function Themes($http){

		var Themes = {};

		/**
		 * @name createTheme
		 * @desc create theme
		 * @return
		 */
		Themes.createTheme = function(data) {
			return $http.post( '/api/v1/themes', data).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name getThemeById
		 * @desc get theme by id
		 * @return
		 */
		Themes.getThemeById = function() {

		};

		/**
		 * @name getThemesByGroupId
		 * @desc get themes by group id
		 * @return
		 */
		Themes.getThemesByGroupId = function(groupId) {
			return $http.get( '/api/v1/themes/group/'+ groupId).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name getDashboardThemeById
		 * @desc get dashboard theme by id
		 * @return
		 */
		Themes.getDashboardThemeById = function() {

		};

		/**
		 * @name getChartThemeById
		 * @desc get chart theme by id
		 * @return
		 */
		Themes.getChartThemeById = function() {

		};

		/**
		 * @name getTableThemeById
		 * @desc get table theme by id
		 * @return
		 */
		Themes.getTableThemeById = function() {

		};

		/**
		 * @name deleteThemeById
		 * @desc delete theme
		 * @return
		 */
		Themes.deleteThemeById = function() {

		};

		/**
		 * @name themeUpdate
		 * @desc update theme
		 * @return
		 */
		Themes.themeUpdate = function(data) {
			return $http.put( '/api/v1/themes', data).then(function(response) {
				return response.data;
			});
		};

		return Themes;
	}
})();
(function(){
'use strict';

angular
	.module('dashboards')
	.factory('Dashboards', Dashboards);

	Dashboards.$inject = ['$http'];

	/**
	 * @name Dashboards
	 * @desc API for dashboards
	 * @memberOf dashboards
	 */
	function Dashboards($http) {
		var Dashboards = {};

		/** 
		 * @name getDashboards
		 * @desc Get dashboards stored in the hearst API.
		 * @return {{JSON}} dashboards, dashboards created by all authors.
		 */
		Dashboards.getDashboards = function(groupId) {
			//return HearstAPI.getDashboards();

			return $http.get('/api/v1/dashboards/group/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name getDashboard
		 * @desc Get dashboard stored in the hearst API.
		 * @return {{JSON}} dashboard, dashboard object.
		 */
		Dashboards.getDashboard = function(id) {
			//return HearstAPI.getDashboard(contentId);

			return $http.get('/api/v1/dashboards/' + id).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name saveDashboard
		 * @desc Save dashboards
		 * @return {{JSON}} dashboard, saved dashboard object.
		 */
		Dashboards.saveDashboard = function(obj) {
			return $http.post('/api/v1/dashboards', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name createRefGroupToDashboard
		 * @desc Created a reference between group and dashboard.
		 * @return {{JSON}} dashboard, saved dashboard object.
		 */
		Dashboards.createRefGroupToDashboard = function(obj) {
			return $http.post('/api/v1/groups/dashboard', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name updateDashboard
		 * @desc Update dashboards
		 * @return {{JSON}} dashboard, updated dashboard object.
		 */
		Dashboards.updateDashboard = function(obj) {
			return $http.put('/api/v1/dashboards', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name deleteDashboards
		 * @desc Delete dashboard entity, the related content entity is also deleted
		 * @params {{Array.Integers}} idArray, an array of dashboard ids to be deleted.
		 */
		Dashboards.deleteDashboard = function(idArray) {
			//return HearstAPI.deleteDashboards(idArray);
			return $http.delete('/api/v1/dashboards/' + idArray).then(function(response) {
				return response.data;
			});
		};

		return Dashboards;
	}
})();
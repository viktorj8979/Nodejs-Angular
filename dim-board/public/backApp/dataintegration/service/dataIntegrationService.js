(function(){
'use strict';

angular
	.module('dataintegration')
	.factory('DataIntegrationService', DataIntegration);

	DataIntegration.$inject = ['$http'];

	/**
	 * @name DataIntegration
	 * @desc API for DataIntegration
	 */
	function DataIntegration($http) {
		var DataIntegration = {};

		/** 
		 * @name getDataIntegrations
		 * @desc Get all dataIntegrations.
		 * @return {{JSON}} dataintegrations, array of dataintegrations objects.
		 */
		DataIntegration.getDataIntegrations = function() {
			return $http.get('/api/v1/dataintegrations').then(function(response) {
				return response.data;
			});
		};

		return DataIntegration;
	}
})();
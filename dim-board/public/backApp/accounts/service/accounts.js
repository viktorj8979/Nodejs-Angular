(function(){
'use strict';

angular
	.module('accounts')
	.factory('Accounts', Accounts);

	Accounts.$inject = ['$http'];

	/**
	 * @name DataIntegration
	 * @desc API for DataIntegration
	 */
	function Accounts($http) {
		var accounts = {};

		/** 
		 * @name getDataIntegrations
		 * @desc Get all dataIntegrations.
		 * @return {{JSON}} dataintegrations, array of dataintegrations objects.
		 */
		accounts.getAccountsByGroupId = function(groupId) {
			return $http.get('/api/v1/accounts/group/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name saveAccount
		 * @desc Save accounts
		 * @return {{JSON}} account, saved account object.
		 */
		accounts.saveAccount = function(obj) {
			return $http.post('/api/v1/accounts', obj).then(function(response) {
				return response.data;
			});
		};

		return accounts;
	}
})();
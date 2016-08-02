(function(){
'use strict';

angular
	.module('members')
	.factory('Members', Members);

	Members.$inject = ['$http'];

	/**
	 * @name Members
	 * @desc API for Members
	 * @memberOf Members
	 */
	function Members($http) {
		var Members = {};

		/** 
		 * @name getMembers
		 * @desc Get Members stored in the hearst API.
		 * @return {{JSON}} Members, Members created by all authors.
		 */
		// Members.updateMember = function(member) {
		// 	return $http.put('/api/v1/users', member).then(function(response) {
		// 		return response.data;
		// 	});
		// };

		return Members;
	}
})();
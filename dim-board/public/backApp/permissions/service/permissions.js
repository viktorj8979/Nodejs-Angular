(function(){
'use strict';

angular
	.module('permissions')
	.factory('Permissions', Permissions);

	Permissions.$inject = ['$http', '$q'];

	/**
	 * @name Permissions
	 * @desc Service for sttings and initializing of permissions
	 * @memberOf permissions
	 */
	function Permissions($http, $q) {
		var Permissions   = {},
			isInitialized = false,
			statesArr     = [];

		/** 
		 * @name setPermissions
		 * @desc Settings of permissions for current user
		 * @return undefined
		 */
		Permissions.setPermissions = function(groups, selectedGroup, user) {
			var userRole    = selectedGroup.user_role,
	            role        = userRole.name,
	            permissions = transformPermissions(userRole.access);

	    	this.initializeStates(permissions);
	    	this.addPermissionsToUser(user, role, permissions);
		};

		/** 
		 * @name setStates
		 * @desc Add curr state to state arr
		 * @return undefined
		 */
		Permissions.addState = function(state) {
			statesArr.push(state);
		};

		/** 
		 * @name resetStates
		 * @desc remove all states from states arr
		 * @return undefined
		 */
		Permissions.resetStates = function(state) {
			statesArr = [];
		};

		/** 
		 * @name initializeStates
		 * @desc initialize states, if user permission for that state available
		 * @return undefined
		 */
		Permissions.initializeStates = function(permissions) {

			if (isInitialized) {
				return;
			}

			isInitialized = true;
			statesArr.forEach(function (state) {
				var name = state.name;

				if (permissions[name] && permissions[name].View) {
					state.init();
				}
			});
		};

		/** 
		 * @name addPermissionsToUser
		 * @desc add role and permissions to current user
		 * @return undefined
		 */
		Permissions.addPermissionsToUser = function(user, role, permissions) {
			_.extend(user, {
	            'role': role,
	            'permissions': permissions
	        });
		};

		/** 
		 * @name transformPermissions
		 * @desc transform permissions object getting from the server
		 * @return {{Object}} permissions, permissions object.
		 */
	    function transformPermissions(permissions) {
	        var permissObj = {};

	        permissions.forEach(function (currAccess) {
	            permissObj[currAccess.name] = transfCurrAccessPermiss(currAccess.permissions);
	        });

	        return permissObj;
	    }

	    /** 
		 * @name transfCurrAccessPermiss
		 * @desc transform access arary in permissions obj
		 * @return {{Object}} access object
		 */
	    function transfCurrAccessPermiss(currPermissions) {
	        var currPermissObj = {};

	        currPermissions.forEach(function (currPermiss) {
	            return currPermissObj[currPermiss.name] = currPermiss.enabled;
	        });

	        return currPermissObj;
	    }

		return Permissions;
	}
})();
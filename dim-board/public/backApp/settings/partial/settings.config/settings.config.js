angular
	.module('settings')
	.controller('SettingsConfigCtrl', SettingsConfigCtrl);

SettingsConfigCtrl.$inject = ['$scope', '$http', 'Settings', '$modal', 'SweetAlert', 'Groups', 'DataIntegrationService', 'Accounts', 'Themes'];

function SettingsConfigCtrl($scope, $http, Settings, $modal, SweetAlert, Groups, DataIntegrationService, Accounts, Themes){
    $scope.selectRole = selectRole;
	/** Roles **/
    $scope.roles = [];
    /* Selected role */
    $scope.selectedRole = {};
    /* Create role name */
    $scope.createdRoleName = '';
    /* Save role */
    $scope.saveRole = saveRole;
    /* Delete role */
	$scope.deleteRole = deleteRole;
	/* Initialize permissions */
	$scope.initPermission = initPermission;
	/* User selected admin role */
	$scope.isChosenAdmin = isChosenAdmin;
    /* Data integrations */
    $scope.dataIntegrations = [];
    /* Selected integration */
    $scope.selectedIntegration = {};
    /* Selected account */
    $scope.accounts = [];
    /* Selected accounts */
    $scope.selectedAccounts = [];
    /* Selected account */
    $scope.selectedAccount = null;
    /* Create new account */
	$scope.createAccount = createAccount;
	/* Save account */
	$scope.saveAccount = saveAccount;
	/* Delete group */
	$scope.deleteGroup = deleteGroup;
	/* see theme core or custom function */
	$scope.groupThemes = groupThemes;
	/* checked permissions */
	$scope.permissionManipulation = permissionManipulation;
	/** themes data **/
	$scope.themes = [];
	$scope.saveTheme 	   = saveTheme;
	$scope.dashboardTheme  = '-1';
	$scope.chartTheme 	   = '-1';
	$scope.tableTheme 	   = '-1';

	init();

	function groupThemes(coreTheme) {
		if(coreTheme === 'true'){
			return 'Core Themes';
		} else {
			return 'Custom Themes';
		}
	}

	function getThemes() {
	    Themes
	        .getThemesByGroupId($scope.$parent.selectedGroup._id)
	        .then(success, error);

	    function success(themes) {
	        if(themes) {
	            $scope.themes = themes.sort(function(obj){
	                if(obj.core_theme === "false"){
	                  return 10;
	                } else {
	                 return 0;
	                }
	            });
	        }
	    }

	    function error(response) {
	        console.log(response);
	    }
	}

	function init() {
		getRoles();
		getDataIntegrations();
		getThemes();
	}

	/**
	 * @name selectRole
	 * @desc Select role
	 */
    function selectRole(role) {
    	$scope.selectedRole = role;
    }

	/** get all roles integrations **/
	function getRoles() {
		Settings.getRolesByGroupId($scope.$parent.selectedGroup._id).then(function (roles) {
			var createRole;

			if (roles.length) {
				createRole   = getCreateRoleObj(roles[0]);
				$scope.roles = roles;
				$scope.roles.push(createRole);
				$scope.selectedRole = $scope.roles[0];
			}
		});
	}

	/** creating of role create obj in role select **/
	function getCreateRoleObj(role) {
		var roleParams    = ['group_id', 'access'],
			createRoleObj = _.extend( { roleCreated: true }, _.pick(role, roleParams) );

		createRoleObj.name 	   = 'Create Role';
		createRoleObj.editable = true;

		return createRoleObj;
	}

	/**
	 * @name saveRole
	 * @desc Save role and make put request on the serever.
	 * Make post request if it is creating of new role 
	 * Make put request if it is updating of the existing role
	 */
	function saveRole(role) {
		var name, createdRole, action;

		if (role.roleCreated) {
			action      = 'created';
			name 		= $scope.createdRoleName;
			createdRole = _.omit( _.clone(role), 'roleCreated' );

			Settings.createRole( _.extend(createdRole, {'name': name}) ).then(success, error);
		} else {
			action = 'updated';

			Settings.updateRoles(role).then(success, error);
		}

		function success(response) {
			SweetAlert.swal(action, "Role was succesfull " + action, "success");
		}

		function error(response) {
			SweetAlert.swal("Error!", "Canot do such action, there is some error!", "error");
		}
	}

	/**
	 * @name deleteRole
	 * @desc Delete role from dom and DB, make delete request to server
	 */
	function deleteRole(role) {
		Settings.deleteRole(role).then(success, error);

		function success(response) {
			SweetAlert.swal("Deleted!", "Role was succesfull deleted", "success");
		}

		function error(response) {
			SweetAlert.swal("Error!", "Cannot delete role, there is some error", "error");
		}
	}

	/**
	 * @name initPermission
	 * @desc Initialize all checkbox to true for creating of new role
	 */
	function initPermission(role, permission) {

		if (role.roleCreated) {  // set all checkbox as checked for creating new role
			return true;
		}

		return permission.enabled
	}

	/**
	 * @name isChosenAdmin
	 * @desc Return true if user choose admin in select roles list
	 */
	function isChosenAdmin(role) {
		return role.name === 'admin';
	}

		/** get data integrations **/
	function getDataIntegrations() {
		DataIntegrationService.getDataIntegrations().then(function (integrations) {
			$scope.dataIntegrations = integrations;
			$scope.selectedIntegration = $scope.dataIntegrations[0];
			getAccounts();
		});
	}

	/** get accounts **/
	function getAccounts() {
		Accounts.getAccountsByGroupId($scope.$parent.selectedGroup._id).then(function (accounts) {
			$scope.accounts = accounts;
			getAccountsByDataIntegrationId($scope.selectedIntegration._id);
		});
	}

	/** get accounts by data integration id **/
	function getAccountsByDataIntegrationId(dataIntegrationId) {
		$scope.selectedAccounts = [];
		$scope.selectedAccounts = _.where($scope.accounts, { dataIntegrationId: $scope.selectedIntegration._id });
	}

	/**
	 * @name createAccount
	 * @desc Display a modal to create account if selected integration.
	 */
	function createAccount() {
		$scope.selectedAccount = {
			groups: [
			    {
			      _id: $scope.$parent.selectedGroup._id,
			      permission_id: 0
			    }
			],
			dataIntegrationId: $scope.selectedIntegration._id,
			name: '',
			accessKeyId: '',
			secretAccessKey: '',
			region: '',
			bucket: ''
		};
	}

	/**
	 * @name saveAccount
	 * @desc Save changed form information for account.
	 */
	function saveAccount() {
		Accounts
			.saveAccount($scope.selectedAccount)
			.then(function (response) {
				console.log(response);
			});
	}

	/**
	 * @name saveTheme
	 * @desc Display a sweetalert to confirm theme updating.
	 * On cancel updating, display a message that the theme updating is canceled
	 * On update, display a message that the theme has been updated.
	 */
	function saveTheme() {
		if(!$scope.selectedGroup.settings.themes.dashboard || !$scope.selectedGroup.settings.themes.card) {
			SweetAlert.swal("Alarm!", "You have to select one of them!", "warning");
			return;
		}
		SweetAlert.swal({
			title: 'Are you sure?',
			text: 'The theme will be updated!',
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, update them!",
			cancelButtonText: "No, cancel please!",
			closeOnConfirm: false,
			closeOnCancel: false
		}, function(isConfirm) {
			if (isConfirm) {
				// will be come here calling api to update theme
				Groups
					.updateGroup($scope.selectedGroup)
					.then(success, error);
			} else {
				SweetAlert.swal("Cancelled", "The theme updating is canceled :)", "error");
			}
		});

		function success(response) {
			console.log('The theme has been updated', response.data);
			SweetAlert.swal("Updated!", "The theme has been updated.", "success");
		}

		function error(response) {
			SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
		}
	}

	/**
	 * @name permissionManipulation
	 * @desc Add logic for manipulation with permissions.
	 */
	function permissionManipulation(currPermission, permissions) {
		var viewPermission;

		if (currPermission.name === 'View') {
			changePermissionsState(permissions, currPermission.enabled);
		} else {
			viewPermission = _.where(permissions, {'name': 'View'})[0];
			permissions    = _.reject(permissions, {'name': 'View'});

			if ( !currPermission.enabled && !isSiblingsDisabled(permissions) ) {
				return changeViewPermissState(viewPermission, false);
			}

			changeViewPermissState(viewPermission, true);
		}
	};

	/**
	 * @name changePermissionState
	 * @desc Change state of the permissions.
	 */
	function changePermissionsState(permissions, isEnabled) {
		permissions.forEach(function (permission) {
			permission.enabled = isEnabled;	
		});
	}

	/**
	 * @name changeViewPermissState
	 * @desc Change state for View permission.
	 */
	function changeViewPermissState(viewPermission, isEnabled) {
		viewPermission.enabled = isEnabled;
	}

	/**
	 * @name isSiblingsDisabled
	 * @desc Check is all siblings are disabled
	 */
	function isSiblingsDisabled(permissions) {
		return  _.where(permissions, {'enabled': true}).length;
	}

	/**
	 * @name deleteGroup
	 * @desc Display a sweetalert to confirm group deletion.
	 * On cancel deletion, display a message that the group
	 * is safe and has not been deleted.
	 * On delete, display a message that the current group has been deleted
	 * and select first group.
	 */
	function deleteGroup() {
		console.log('selected group2:', $scope.selectedGroup);
		SweetAlert.swal({
			title: 'Are you sure?',
			text: 'You will not be able to recover these group!',
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes, delete them!",
			cancelButtonText: "No, cancel please!",
			closeOnConfirm: false,
			closeOnCancel: false
		}, function(isConfirm) {
			if (isConfirm) {
				Groups
					.deleteGroup($scope.selectedGroup._id)
					.then(success, error);
			} else {
				SweetAlert.swal("Cancelled", "This group are safe :)", "error");
			}
		});

		function success(response) {
			SweetAlert.swal("Deleted!", "This group has been deleted.", "success");
			$scope.$parent.getGroups();
		}

		function error(response) {
			SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
		}
	}

	$scope.$watch('selectedIntegration', function(selectedIntegration) {
		if(selectedIntegration._id) {
			getAccountsByDataIntegrationId(selectedIntegration._id);
		}
	});
}


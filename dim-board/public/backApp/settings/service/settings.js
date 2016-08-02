(function(){
    'use strict';

    angular
        .module('settings')
        .factory('Settings', Settings);

    Settings.$inject = ['$http'];

    /**
     * @name Files
     * @desc API for files
     * @memberOf files
     */
    function Settings($http) {
        var settingInfo = {};
        var Settings = {};

        Settings.getPermissions = function() {
            return $http.get('/api/v1/permissions')
                .then(function(response) {
                    return response;
                });
        };

        Settings.getThemes = function(groupId) {
            console.log(groupId);
            return $http.get('/api/v1/themes/group/' + groupId)
                .then(function(response) {
                    return response;
                });
        }

        Settings.createRole = function(newRole) {
            return $http.post('/api/v1/roles', newRole)
                .then(function(response) {
                    return response;
                });
        }

        Settings.getRoles = function(groupId) {
            return $http.get('/api/v1/roles/'+ groupId)
                .then(function(response) {
                    return response;
                });
        };

        Settings.getRolesByGroupId = function(groupId) {
            return $http.get('/api/v1/roles/groups/'+ groupId)
                .then(function(response) {
                    return response.data;
                });
        };

        Settings.updateRoles = function(role) {
            return $http.put('/api/v1/roles', role)
                .then(function(response) {
                    return response;
                });
        };

        Settings.deleteRole = function(role) {
            return $http.delete('/api/v1/roles/' + role._id)
                .then(function(response) {
                    return response;
                });
        };


        Settings.getGroupData = function(groupId) {
            return $http.get('/api/v1/groups/'+ groupId)
                .then(function(response) {
                    console.log(response);
                    return response;
                });
        };

        Settings.updateGroupData = function(groupId, groupData) {
            var dataObj = { groupId : groupId, groupBody: groupData};
            return $http.put('/api/v1/groups',dataObj)
                .then(function(response) {
                    return response;
                });
        }

        Settings.deleteGroup = function(groupId) {
            return $http.delete('/api/v1/groups/'+ groupId)
                .then(function(response) {
                    var index;
                    // _.find(State.dim.groups, function(group, i){ 
                    //    if(group['_id'] == groupId){ index = i; return true;}; 
                    // });

                    // State.dim.groups.splice(index, 1);
                    // $.extend( State.dim.group, State.dim.groups[0] );

                    return response;
                });
        };


        Settings.setSettingInfo = function ( arrRole ) {
            settingInfo = {
                roleIds: arrRole.roleIds,
                permissionIds: arrRole.permissionIds,
                groupId: arrRole.groupId,
                groupData: arrRole.groupData
            };
        };

        Settings.getSettingInfo = function() {
            return settingInfo;
        };

        return Settings;
    }
})();
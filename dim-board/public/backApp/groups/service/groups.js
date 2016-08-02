(function(){
'use strict';

angular
	.module('groups')
	.factory('Groups', Groups);

	Groups.$inject = ['$http'];

	/**
	 * @name Dashboards
	 * @desc API for dashboards
	 * @memberOf dashboards
	 */
	function Groups($http) {
		var Groups = {};
		var selectedGroup = {};
		var groupList = [];
	    var dashboardsList = [];
	    var cardsList = [];
	    var datasourcesList = [];
	    var membersList = [];

		/** 
		 * @name selectedGroup
		 * @desc Get current group selected.
		 * @return {{Object}} group, group object.
		 */
		Groups.selectedGroup = function(group) {
			if(group) {
				selectedGroup = group;
			}
			return selectedGroup;
		};

		/**
		 * @name list
		 * @desc Get list of groups user has access to.
		 * @return {{Array}} groups, group objects.
		 */
		Groups.list = function(groups) {
			if(groups) {
				groupList = groups;
			}
			return groupList;
		};

		/**
		 * @name dashboards
		 * @desc Get list of dashboards.
		 * @return {{Array}} dashboards, dashboard objects.
		 */
		Groups.dashboards = function(dashboards) {
			if(dashboards) {
				dashboardsList = dashboards;
			}
			return dashboardsList;
		};

		/**
		 * @name cards
		 * @desc Get list of cards.
		 * @return {{Array}} cards, card objects.
		 */
		Groups.cards = function(cards) {
			if(cards) {
				cardsList = cards;
			}
			return cardsList;
		};

		/**
		 * @name datasources
		 * @desc Get list of datasources.
		 * @return {{Array}} datasources, datasource objects.
		 */
		Groups.datasources = function(datasources) {
			if(datasources) {
				datasourcesList = datasources;
			}
			return datasourcesList;
		};


		/**
		 * @name getMembersByGroupId
		 * @desc Get datasources related to groups.
		 * @return {{JSON}} datasources, Return all datasources related to a group.
		 */
		Groups.getMembersByGroupId = function(groupId) {
			return $http.get('/api/v1/groups/member/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name deleteMember
		 * @desc delete member.
		 * @return "success" message.
		 */
		Groups.deleteMembers = function(groupId,memberIds) {
			return $http.delete('/api/v1/groups/member/'+ groupId +'/'+ memberIds)
				.then(function(response) {
					return response.data;
				});
		};

		/**
		 * @name members
		 * @desc Get list of members.
		 * @return {{Array}} members, member objects.
		 */
		Groups.members = function(members) {
			if(members) {
				membersList = members;
			}
			return membersList;
		};

		/**
		 * @name updateMember
		 * @desc Update Member.
		 * @return  {{Object}} member, member object.
		 */
		Groups.updateMember = function(member) {
			return $http.put('/api/v1/groups/member',{
				"group_id":  member.role.group_id,
				"member_id" : member._id,
				"first_name" : member.first_name,
				"last_name" : member.last_name,
				"email" : member.email,
				"role_id" : member.role._id
			}).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name getGroups
		 * @desc Get groups by current user. (group.users_id array is excluded)
		 * @return {{Array}} groups, groups array.
		 */
		Groups.getGroups = function() {
			//return $http.get('/api/v1/groups/currentuser').then(function(response) {
			return $http.get('/api/v1/groups').then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name getDashboardsByGroupId
		 * @desc Get dashboards related to groups.
		 * @return {{JSON}} dashboards, Return all dashboards related to a group.
		 */
		Groups.getDashboardsByGroupId = function(groupId) {
			return $http.get('/api/v1/groups/dashboard/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name getCardsByGroupId
		 * @desc Get cards related to groups.
		 * @return {{JSON}} cards, Return all cards related to a group.
		 */
		Groups.getCardsByGroupId = function(groupId) {
			return $http.get('/api/v1/groups/card/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name getDatasourcesByGroupId
		 * @desc Get datasources related to groups.
		 * @return {{JSON}} datasources, Return all datasources related to a group.
		 */
		Groups.getDatasourcesByGroupId = function(groupId) {
			return $http.get('/api/v1/groups/datasource/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/**
		 * @name createGroup
		 * @desc create group with group name.
		 * @return {{JSON}} groups, groups array.
		 */
		Groups.createGroup = function(groupName) {
			var groupObj = {
				name: groupName
			};

			return $http.post('/api/v1/groups', groupObj).then(function(response) {
				return response;
			});
		};

		/**
		 * @name updateGroup
		 * @desc update group with group name.
		 * @return {{JSON}} groups, groups array.
		 */
		Groups.updateGroup = function(groupObj) {
			return $http.put('/api/v1/groups', groupObj).then(function(response) {
				return response;
			});
		};

		/**
		 * @name deleteGroup
		 * @desc create group with group name.
		 * @return "success" message.
		 */
		Groups.deleteGroup = function(groupId) {
			return $http.delete('/api/v1/groups/'+ groupId)
				.then(function(response) {
					return response;
				});
		};

		return Groups;
	}
})();
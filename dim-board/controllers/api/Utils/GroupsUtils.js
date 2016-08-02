var RoleModel = require('./../../../models/role'),
	async     = require('async'),
	mongoose  = require('mongoose');

module.exports = {
	setRoles: setRoles,
	generateUsersIDArr: generateUsersIDArr
};

function setRoles(userGroups, user, next) {

	if (!next && (typeof user === 'function' ) ) {
		next = user;
		user = false;
	}

	async.map(userGroups, function (group, call) {

		if (!user) {
			setAllRoles(group, call);
		} else {
			setUserGroupRole(user, group, call);
		}
	}, next);
}

function generateUsersIDArr(members) {
	return members.map(function (member) {
        return member.users_id;
   	});
}

function setAllRoles(group, call) {
	var groupId = group._id;

	RoleModel.findOne({
		group_id: groupId
	}).exec(function (err, role) {

		if (err) {
			return call(err);
		}

		group.user_role = role;
		call(null, group);
	});
}

function setUserGroupRole(user, group, call) {
	var userID = user.auth0id.replace('auth0|', ''),
		member, roleID;

	member = group.members.filter(function (member) {
		return member.users_id == userID;
	});
	roleID = member[0].role_id;

	RoleModel.findOne(roleID).exec(function (err, role) {

		if (err) {
			return call(err);
		}

		group.user_role = role;
		call(null, group);
	});
}
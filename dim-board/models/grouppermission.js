/**
 * A model for GroupPermission 
 */
'use strict';

var mongoose = require('mongoose');


var groupPermissionModel = function () {

	var groupPermissionSchema = mongoose.Schema({
		name: { type: String, index: true },
		description: String
	});

	return mongoose.model('GroupPermission', groupPermissionSchema);
}

module.exports = new groupPermissionModel();
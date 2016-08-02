/**
 * A model for Embed
 */
'use strict';

var mongoose = require('mongoose');


var embedModel = function () {

	var embedSchema = mongoose.Schema({
		name: type: String,,
		description: String,
		created_on: Date,
		created_by: Object,
		modified_on: Date
		modified_by: Object
	});

	return mongoose.model('Embed', embedSchema);
}

module.exports = new embedModel();
/**
 * A model for Data Integration
 */
'use strict';

var mongoose = require('mongoose');


var dataIntegrationModel = function () {

	var dataIntegrationSchema = mongoose.Schema({
		name: String,
		image_path: String
	}, {
		versionKey: false
	});

	dataIntegrationSchema.statics.updateIntegration = function (integrationBody, callback) {
		this.findOneAndUpdate(
			{ _id: integrationBody._id },
			{ $set:{
				name: integrationBody.name,
				image_path: integrationBody.image_path
			}}, callback);
	}

	return mongoose.model('DataIntegration', dataIntegrationSchema);
}

module.exports = new dataIntegrationModel();
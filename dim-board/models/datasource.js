/**
 * A model for Datasource 
 */
'use strict';

var mongoose = require('mongoose');


var datasourceModel = function () {

	var datasourceSchema = mongoose.Schema({
    	groups: Array,
		title: String,
		data_format: String,
		data_location: String,
		data_path: String,
		dataIntegrationId: String,
		accountId: String,
		dataIntegration: Object,
		account: Object,
		refreshed_on: Date,
		created_on: Date,
		created_by: Object,
		modified_on: Date,
		modified_by: Object
	});

	datasourceSchema.statics.updateDatasource = function (datasourceBody, callback) {
		this.findOneAndUpdate(
			{ _id: datasourceBody._id },
			{ $set:{
				title: datasourceBody.title,
				data_format: datasourceBody.data_format,
				data_location: datasourceBody.data_location,
				data_path: datasourceBody.data_path,
				dataIntegrationId: datasourceBody.dataIntegrationId,
				accountId: datasourceBody.accountId,
				refreshed_on: datasourceBody.refreshed_on
			}}, callback);
	}


	return mongoose.model('Datasource', datasourceSchema);
}

module.exports = new datasourceModel();
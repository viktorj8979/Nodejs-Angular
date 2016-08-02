/**
 * A model for Account 
 */
'use strict';

var mongoose = require('mongoose');


var accountModel = function () {

	var accountSchema = mongoose.Schema({
        groups: Array,
        dataIntegrationId: String,
        name: String,
        credentials: Object,
		created_on: Date,
		created_by: Object,
		modified_on: Date,
		modified_by: Object
	});

  // Update Account method
  accountSchema.statics.updateAccount = function (accountBody, callback) {
    this.findOneAndUpdate(
      { _id: accountBody._id },
      { $set: {
        name: accountBody.name,
        dataIntegrationId: accountBody.dataIntegrationId,
        credentials: accountBody.credentials,
        modified_on: new Date(),
        modified_by: accountBody.modified_by
      }}, callback);
  };

	return mongoose.model('Account', accountSchema);
}

module.exports = new accountModel();
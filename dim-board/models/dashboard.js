/**
 * A model for Dashboard 
 */
'use strict';

var mongoose = require('mongoose');


var dashboardModel = function () {

	var dashboardSchema = mongoose.Schema({
    groups: Array,
    title: String,
    thumb_url: String,
		description: String,
    cards: Array,
    settings: Object,
		created_on: Date,
		created_by: Object,
		modified_on: Date,
		modified_by: Object
	});

  // Update Dashboard method
  dashboardSchema.statics.updateDashboard = function (dashboardBody, callback) {
    this.findOneAndUpdate(
      { _id: dashboardBody._id },
      { $set: {
        title: dashboardBody.title,
        thumb_url: dashboardBody.thumb_url,
        description: dashboardBody.description,
        cards: dashboardBody.cards,
        settings: dashboardBody.settings,
        modified_on: new Date(),
        modified_by: dashboardBody.modified_by
      }}, callback);
  };
  
	return mongoose.model('Dashboard', dashboardSchema);
}

module.exports = new dashboardModel();
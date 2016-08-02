/**
 * A model for File 
 */
'use strict';

var mongoose = require('mongoose');


var themeModel = function () {

	var themeSchema = mongoose.Schema({
		group_id: { type: String, index: true },
		name: String,
		data: Object,
		type: String,
		core_theme: String,
		created_on: Date,
		created_by: String,
		modified_on: Date
	});

	themeSchema.index({group_id: 1, name: 1}, {unique: true});

  // Update Theme method
  themeSchema.statics.updateTheme = function (themeBody, callback) {
    this.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(themeBody._id)},
      { $set: {
        name: themeBody.name,
        group_id: themeBody.group_id,
        data: themeBody.data,
        type: themeBody.type,
        core_theme: themeBody.core_theme,
        modified_on: new Date(),
        modified_by: themeBody.modified_by
      }}, callback);
  };

	return mongoose.model('Theme', themeSchema);
}

module.exports = new themeModel();
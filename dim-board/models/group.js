/**
 * A model for Group 
 */
'use strict';

var mongoose = require('mongoose');


var groupModel = function () {

  var groupSchema = mongoose.Schema({
    members : Array,
    name: {type: String},
    description: String,
    user_role: Object,
    created_on: Date,
    created_by: Object,
    modified_on: Date,
    modified_by: Object,
    settings: Object
  });

  // Update Group method
  groupSchema.statics.updateGroup = function (groupBody, callback) {
    this.findOneAndUpdate(
      { _id: mongoose.Types.ObjectId(groupBody._id)},
      { $set: {
        name: groupBody.name,
        //description: groupBody.description,
        modified_on: new Date(),
        modified_by: groupBody.modified_by,
        settings: groupBody.settings
      }}, callback);
  };

  return mongoose.model('Group', groupSchema);
}

module.exports = new groupModel();
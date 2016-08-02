/**
 * A model for Role
 */
'use strict';

var mongoose = require('mongoose'),
    commonutil = require('../lib/common_util'),
    util = require('util');


var roleModel = function () {

  var roleModelSchema = mongoose.Schema({
    group_id: { type: mongoose.Schema.ObjectId, index: true },
    name: String,
    editable: Boolean,
    access: Array,
    created_on: Date,
    created_by: Object,
    modified_on: Date,
    modified_by: Object
  });

  // Update Role method
  roleModelSchema.statics.updateRole = function (roleBody, callback) {

  //create ObjectId for group_id (group_id comes as string from client)
  if (roleBody.group_id && commonutil.isObjectId(roleBody.group_id)) {
    roleBody.group_id = mongoose.Types.ObjectId(roleBody.group_id);
  }

//editable and group_id fields are not allowed to be updated.
  this.findOneAndUpdate(
    { _id: roleBody._id },
    { $set: {
      name: roleBody.name,
      access: roleBody.access,
      modified_on: new Date(),
      modified_by: roleBody.modified_by
    }}, callback);
  };

  
  return mongoose.model('Role', roleModelSchema);
}

module.exports = new roleModel();

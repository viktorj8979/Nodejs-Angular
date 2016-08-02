/**
 * A model for CardComment
 */
'use strict';

var mongoose = require('mongoose'),
    commonutil = require('../lib/common_util');


var cardCommentModel = function () {

  var cardCommentSchema = mongoose.Schema({
    dashboard_id: { type: mongoose.Schema.ObjectId, index: true },
    card_id: { type: mongoose.Schema.ObjectId, index: true },
    text: String,
    created_on: Date,
    created_by: Object,
    modified_on: Date,
    modified_by: Object
  });

  // Update card comment method
  cardCommentSchema.statics.updateCardComment = function (cardCommentBody, callback) {

        //create ObjectId for dashboard_id (dashboard_id comes as string from client)
    if (cardCommentBody.dashboard_id && commonutil.isObjectId(cardCommentBody.dashboard_id)) {
            cardCommentBody.dashboard_id = mongoose.Types.ObjectId(cardCommentBody.dashboard_id);
    }

    //create ObjectId for card_id (card_id comes as string from client)
    if (cardCommentBody.card_id && commonutil.isObjectId(cardCommentBody.card_id)) {
            cardCommentBody.card_id = mongoose.Types.ObjectId(cardCommentBody.card_id);
    }
    

    this.findOneAndUpdate(
      { _id: cardCommentBody._id },
      { $set: {
        card_id: cardCommentBody.card_id,
        dashboard_id: cardCommentBody.dashboard_id,
        text: cardCommentBody.text,
        modified_on: new Date(),
        modified_by: cardCommentBody.modified_by
      }}, callback);
  };

  return mongoose.model('Card_Comment', cardCommentSchema);
}

module.exports = new cardCommentModel();

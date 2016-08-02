/**
 * A model for Card 
 */
'use strict';

var mongoose = require('mongoose');


var cardModel = function () {

	var cardSchema = mongoose.Schema({
        groups: Array,
        datasources: Array,
    	title: String,
        description: String,
        thumb_url: String,
        alerts: Array,
        comments: Array,
        widget: String,
        sizeX: String,
        sizeY: String,
        settings: Object,
        cardOptions: Array,
        elem: String,
		share_url: String,
		created_on: Date,
		created_by: Object,
		modified_on: Date,
		modified_by: Object
	});

  // Update Card method
  cardSchema.statics.updateCard = function (cardBody, callback) {
    this.findOneAndUpdate(
      { _id: cardBody._id },
      { $set: {
        title: cardBody.title,
        thumb_url: cardBody.thumb_url,
        alerts: cardBody.alerts,
        comments: cardBody.comments,
        widget: cardBody.widget,
        sizeX: cardBody.sizeX,
        sizeY: cardBody.sizeY,
        settings: cardBody.settings,
        options: cardBody.cardOptions,
        elem: cardBody.elem,
        datasources: cardBody.datasources,
        description: cardBody.description,
        share_url : cardBody.share_url,
        modified_on: new Date(),
        modified_by: cardBody.modified_by
      }}, callback);
  };

	return mongoose.model('Card', cardSchema);
}

module.exports = new cardModel();
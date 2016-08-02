/**
 * A util module contains common api functions 
 */
var mongoose = require('mongoose');


exports.isObjectId = function (val) {
    return mongoose.Types.ObjectId.isValid(val);
}

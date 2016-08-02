/** 
 * CardComment API calls
 */

var CardCommentModel = require('../../../models/cardcomment');
var UserModel = require('../../../models/user');

module.exports = function(router) {
    router.get('/api/v1/cardcomments', getAllCardComment);
    router.get('/api/v1/cardcomments/:cardcommentId', getCardCommentById);
    router.post('/api/v1/cardcomments', createCardComment);
    router.put('/api/v1/cardcomments', updateCardComment);
    router.delete('/api/v1/cardcomments/:cardcommentId', deleteCardCommentById);
};

var getAllCardComment = function(req, res) {
    CardCommentModel.find(function(err, cardcomment) {
        res.send(cardcomment);
    });
};

var createCardComment = function(req, res) {
    req.body.created_on = new Date();
    req.body.modified_on = new Date();

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (user) {
            req.body.created_by = {
                "_id": user._id, 
                "first_name": user.first_name, 
                "last_name": user.last_name,
                "email": user.email
            };
            req.body.modified_by = {
                "_id": user._id, 
                "first_name": user.first_name, 
                "last_name": user.last_name,
                "email": user.email
            };

            var cardcomment = new CardCommentModel(req.body);

            cardcomment.save(function(err, newCardComment) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(newCardComment);
                }
            });
        } else {
            res.send('Can not find auth0 user in database');
        }
    });
};

var getCardCommentById = function(req, res) {
    CardCommentModel.findOne({_id : mongoose.Types.ObjectId(req.params.cardcommentId) },function(err, cardcomment) {
        res.send(cardcomment);
    });
};

var deleteCardCommentById = function(req, res) {
    CardCommentModel.remove({_id: mongoose.Types.ObjectId(req.params.cardcommentId)}, function(err, cardcomment) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
};

var updateCardComment = function(req, res) {
    var cardcommentBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                cardcommentBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };

                CardCommentModel.updateCardComment(cardcommentBody, function(err, cardcomment) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(cardcomment);
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}
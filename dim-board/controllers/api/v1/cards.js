/** 
 * Card API calls
 */

var CardModel = require('../../../models/card'),
    DatasourceModel = require('../../../models/datasource'),
    DashboardModel = require('../../../models/dashboard'),
    GroupModel = require('../../../models/group'),
    UserModel = require('../../../models/user'),
    util = require('util'),
    mongoose = require('mongoose'),
    CardCommentModel = require('../../../models/cardcomment'),
    async = require('async');



module.exports = function(router) {
    router.get('/api/v1/cards', getAllCards);
    router.get('/api/v1/cards/:cardId', getCardById);
    router.get('/api/v1/cards/group/:cardId', getGroupsByCardId);
    router.get('/api/v1/cards/dashboard/:cardId', getDashboardsByCardId);
    router.post('/api/v1/cards', createCard);
    //router.post('/api/v1/cards/group', createRefCardToGroup);
    //router.post('/api/v1/cards/dashboard', createRefCardToDashboard);
    //router.post('/api/v1/cards/datasource', createRefCardToDatasource);
    router.put('/api/v1/cards', updateCard);
    router.delete('/api/v1/cards/:cardId', deleteCardById);
    //router.delete('/api/v1/cards/datasource/:cardId', deleteRefCardToDatasourceByCardId);
    //router.delete('/api/v1/cards/:cardId/datasource/:datasourceId', deleteRefCardToDatasourceByCardIdAndDatasourceId);
    router.delete('/api/v1/cards/dashboard/:cardId', deleteRefCardToDashboardByCardId);
    router.delete('/api/v1/cards/:cardId/dashboard/:dashboardId', deleteRefCardToDashboardByCardIdAndDashboardId);
    //router.delete('/api/v1/cards/group/:cardId', deleteRefCardToGroupByCardId);
    //router.delete('/api/v1/cards/:cardId/group/:groupId', deleteRefCardToGroupByCardIdAndGroupId);
};

/* return all available cards
*/
var getAllCards = function(req, res) {
    CardModel.find(function(err, cards) {
        if (err)
            console.log(err);
        else
            res.jsonp(cards);
    });
}

/* Get Card by id 
 * It should consider whether to return all references in this call
 */
var getCardById = function(req, res) {
    CardModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.cardId)
    }, function(err, card) {
        if (err)
            console.log(err);
        else
            res.jsonp(card);
    });
}

/* 
 * Get Groups referenced to Card 
 */
var getGroupsByCardId = function(req, res) {
    CardModel.findOne({_id: req.params.cardId}, {_id: 0, groups: 1}, function(err, groups) {
        if (err)
            console.log(err);
        else
            res.jsonp(card);
    });



    GroupToCardModel.find({card_id: req.params.cardId}, 
        {_id: 0, group_id: 1}, function(err, dbIds) {
            var arr = new Array();
            for(var i = 0; i < dbIds.length; i++) {
                arr.push(dbIds[i].group_id);
            }
            var obj = {};
            obj['$in'] = arr;
            GroupModel.find({_id: obj}, function(err, groups) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.jsonp(groups);
                }
            });
    });
}


/* Get Dashboards referenced to Card 
 */
var getDashboardsByCardId = function(req, res) {
    DashboardModel.find({cards: {$elemMatch: {_id: mongoose.Types.ObjectId(req.params.cardId)}}}, function(err, dashboards) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(dashboards);
        }
    });
}

/** This call allow to create a new Card object
 * @param card object: {group_id: string, file_id: string, title: string, data: array, created_by: string, modified_by: string}
 *
 */
var createCard = function(req, res) {
    req.body.created_on = new Date();
    req.body.modified_on = new Date();
    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        }
        else {
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

                req.body.groups[0]._id = mongoose.Types.ObjectId(req.body.groups[0]._id);

                var card = new CardModel(req.body);

                card.save(function(err, newcard) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(newcard);
                    }
                });  
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}

var createRefCardToGroup = function(req, res) {
    var grpmt = new GroupToCardModel(req.body);

    grpmt.save(function(err, newgrpmt) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(newgrpmt);
        }
    });  
}

var createRefCardToDatasource = function(req, res) {
    var mtds = new CardToDatasourceModel(req.body);

    mtds.save(function(err, newmtds) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(newmtds);
        }
    });  
}

var createRefCardToDashboard = function(req, res) {
    var mtdb = new CardToDashboardModel(req.body);

    mtdb.save(function(err, newmtdb) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(newmtdb);
        }
    });  
}

/*upate card call
*/
var updateCard = function(req, res) {
    var userToken = req.user;
    var cardBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                cardBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };
                cardBody.modified_on = new Date();

                CardModel.updateCard(cardBody, function(err, card) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(card);
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}

/* 
 * Delete reference between Card and Datasource by CardId 
 */
var deleteRefCardToDatasourceByCardId = function(req, res) {
    CardToDatasourceModel.remove({card_id: req.params.cardId}, function(err, mtdss) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}

/* 
 * Delete reference between Card and Datasource by CardId and DatasourceId
 */
var deleteRefCardToDatasourceByCardIdAndDatasourceId = function(req, res) {
    CardToDatasourceModel.remove({card_id: req.params.cardId, datasource_id: req.params.datasourceId}, 
        function(err, mtdss) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}

/* 
 * Delete reference between Card and Dashboard by CardId
 */
var deleteRefCardToDashboardByCardId = function(req, res) {
    DashboardModel.update({cards: {$elemMatch: {_id: mongoose.Types.ObjectId(req.params.cardId)}}},
    {$pull: {cards: {_id: mongoose.Types.ObjectId(req.params.cardId)}}}, function(err, updatedcount) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("success");
        }
    });
}

/* 
 * Delete reference between Card and Dashboard by CardId and DashboardId
 */
var deleteRefCardToDashboardByCardIdAndDashboardId = function(req, res) {
    DashboardModel.update({_id: mongoose.Types.ObjectId(req.params.dashboardId), cards: {$elemMatch: {_id: mongoose.Types.ObjectId(req.params.cardId)}}},
    {$pull: {cards: {_id: mongoose.Types.ObjectId(req.params.cardId)}}}, function(err, updatedcount) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("success");
        }
    });
}

/* 
 * Delete reference between Card and Group by CardId
 */
var deleteRefCardToGroupByCardId = function(req, res) {
    CardToGroupModel.remove({card_id: req.params.cardId}, function(err, mtgrp) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}

/* 
 * Delete reference between Card and Group by CardId and GroupId
 */
var deleteRefCardToGroupByCardIdAndGroupId = function(req, res) {
    CardToGroupModel.remove({card_id: req.params.cardId, groupd_id: req.params.groupId}, 
        function(err, mtgrps) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}

/* Delete Card by id call
 * We delete all references in this call
 * We should consider transactions here
 */
var deleteCardById = function(req, res) {
    var cardIds = req.params.cardId.split(",");
    async.each(cardIds, deleteCard, function(err) {
        if (err) {
            res.send(err);
        }
        else {
            res.send("success");
        }
    });
}

var deleteCard = function(curCardId, callback) {
    CardModel.remove({_id: mongoose.Types.ObjectId(curCardId)}, function(err, removedcount) {
        if(err) {
            console.log(err);
        } else {
            DashboardModel.update({cards: {$elemMatch: {_id: mongoose.Types.ObjectId(curCardId)}}},
            {$pull: {cards: {_id: mongoose.Types.ObjectId(curCardId)}}}, function(err, updatedcount) {
                if (err) {
                    console.log(err);
                }
                else {
                    CardCommentModel.remove({card_id: mongoose.Types.ObjectId(curCardId)}, function(err, cardcomment) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            callback();
                        }
                    });
                }
            });
        }
    });
}


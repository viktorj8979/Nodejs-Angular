/** 
 * Datasource API calls
 */

var DatasourceModel = require('../../../models/datasource'),
    UserModel = require('../../../models/user'),
    mongoose = require('mongoose'),
    util = require('util'),
    async = require('async'),
    AccountModel = require('../../../models/account'),
    CardModel = require('../../../models/card'),
    DataIntegrationModel = require('../../../models/dataintegration');

module.exports = function(router) {

    router.get('/api/v1/datasources', getAllDatasources);
    router.get('/api/v1/datasources/groups/:groupId', getDatasourcesByGroupId);
    router.get('/api/v1/datasources/:datasourceId', getDatasourceById);
    router.post('/api/v1/datasources', createDatasource);
    router.put('/api/v1/datasources', updateDatasource);
    router.delete('/api/v1/datasources/:datasourceId', deleteDatasourceById);
};

var getAllDatasources = function(req, res) {
    DatasourceModel.find(function(err, datasources) {
        res.jsonp(datasources);
    });
}

/** This call allow to create a new Datasource object
 * @param datasource object: {group_id: string, datasource_id: string, title: string, data: array, created_by: string, modified_by: string}
 *
 */
var createDatasource = function(req, res) {
    if (req.body) {
        delete req.body.account; // this field is added from dataintegrations collection when needed.
        delete req.body.dataIntegration; // this field is added from dataintegrations collection when needed.
        req.body.created_on = new Date();
        req.body.modified_on = new Date();

        UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
            if (err) {
                console.log(err);
            } else {
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

                    var datasource = new DatasourceModel(req.body);

                    datasource.save(function(err, newdatasource) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.jsonp(newdatasource);
                        }
                    });                    
                } else {
                    res.send('Can not find auth0 user in database');
                }
            }
        });
    } else {
        res.send("Income Object is null");
    }
}

var getDatasourceById = function(req, res) {
    DatasourceModel.find({_id: mongoose.Types.ObjectId(req.params.datasourceId)}, function(err, datasources) {
        async.each(datasources, extendDatasourceObject, function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                if (datasources && datasources.length > 0)
                    res.send(datasources[0]);
                else
                    res.send(null);
            }
        });
    });
}

var getDatasourcesByGroupId = function(req, res) {
    DatasourceModel.find({groups: {$elemMatch: {_id: mongoose.Types.ObjectId(req.params.groupId)}}}, 
        function(err, datasources) {
        async.each(datasources, extendDatasourceObject, function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            else {
                res.send(datasources);
            }
        });
    });
}

var extendDatasourceObject = function(datasource, callback) {
    if (datasource.dataIntegrationId && datasource.accountId) {
        async.parallel([
            function(callbackinner) {
                DataIntegrationModel.findOne({_id: datasource.dataIntegrationId}, function (err, dataIntegration) {
                    if (err) {
                        callbackinner(err);
                    } else {
                        if (dataIntegration) {
                            datasource.dataIntegration = dataIntegration;
                            callbackinner();
                        } else {
                            callbackinner(new Error("Can not find dataIntegration wit _id = " + datasource.dataIntegrationId));
                        }

                    }
                });
            },
            function(callbackinner) {
                AccountModel.findOne({_id: datasource.accountId}, function (err, account) {
                    if (err) {
                        callbackinner(err);
                    }
                    else {
                        if (account) {
                            datasource.account = account;
                            callbackinner();
                        } else {
                            callbackinner(new Error("Can not find Account wit _id = " + datasource.accountId));
                        }
                    }
                });
            }],
            function(err) {
                if (err) {
                    callback(err);
                } else {
                    callback();
                }
            }
        );
    } else {
        callback(new Error("DataIntegrationId or accountId is null in datasource (_id=" + datasource._id + ")"));
    }
}

var deleteDatasourceById = function(req, res) {
    var datasourceIds = req.params.datasourceId.split(",");
    async.each(datasourceIds, deleteDatasource, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("success");
        }
    });
}

var deleteDatasource = function(datasourceId, callback) {
    DatasourceModel.remove({_id: datasourceId}, function(err, removedcount) {
        if(err) {
            console.log(err);
        } else {
            CardModel.update({datasources: {$elemMatch: {_id: mongoose.Types.ObjectId(datasourceId)}}},
            {$pull: {datasources: {_id: mongoose.Types.ObjectId(datasourceId)}}}, function(err, updatedcount) {
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

var updateDatasource = function(req, res) {
    var userToken = req.user;
    var datasourceBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                datasourceBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };
                datasourceBody.modified_on = new Date();

                DatasourceModel.updateDatasource(datasourceBody, function(err, datasource) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(datasource);
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}

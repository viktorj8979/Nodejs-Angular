/** 
 * Group API calls
 */

var GroupModel = require('../../../models/group'),
    DashboardModel = require('../../../models/dashboard'),
    CardModel = require('../../../models/card'),
    GroupsUtils = require('../Utils/GroupsUtils'),
    DatasourceModel = require('../../../models/datasource'),
    UserModel = require('../../../models/user'),
    ThemeModel = require('../../../models/theme'),
    mongoose = require('mongoose'),
    util = require('util'),
    async = require('async'),
    AccountModel = require('../../../models/account'),
    DataIntegrationModel = require('../../../models/dataintegration'),
    RoleModel = require('../../../models/role');

module.exports = function(router) {
    router.get('/api/v1/groups', getAllGroups);
    router.get('/api/v1/groups/currentuser', getGroupsByCurrentUser);
    router.get('/api/v1/groups/:groupId', getGroupById);
    router.get('/api/v1/groups/dashboard/:groupId', getDashboardsByGroupId);
    router.get('/api/v1/groups/card/:groupId', getCardsByGroupId);
    router.get('/api/v1/groups/datasource/:groupId', getDatasourcesByGroupId);
    router.get('/api/v1/groups/member/:groupId', getMembersByGroupId);
    router.get('/api/v1/groups/references/:groupId', getGroupReferencesByGroupId);
    router.post('/api/v1/groups/member', createRefGroupToMember);
    router.post('/api/v1/groups', createGroup);
    router.post('/api/v1/groups/dashboard', createRefGroupToDashboard);
    //router.post('/api/v1/groups/datasource', createRefGroupToDataSource);
    router.put('/api/v1/groups', updateGroup);
    router.put('/api/v1/groups/member', updateRefGroupToMember);
    router.delete('/api/v1/groups/member/:groupId/:memberIds', deleteRefGroupToMember);
    router.delete('/api/v1/groups/dashboard', deleteRefGroupToDashboard);
    router.delete('/api/v1/groups/:groupId', deleteGroupById);
};

var getAllGroups = function(req, res) {
    GroupModel.find(function(err, groups) {
        res.send(groups);
    });
};

var getGroupsByCurrentUser = function(req, res) {
    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {

                GroupModel.find({
                    members: {
                        $elemMatch: {
                            users_id: user._id
                        }
                    }
                }).exec(function (err, groups) {

                    if (err) {
                        return res.status(400).send(err);
                    }

                    GroupsUtils.setRoles(groups, user, function (err, data) {

                        if (err) {
                            return res.status(400).send(err);
                        }

                        res.status(200).send(groups);
                    });
                });

            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
};


var getGroupById = function(req, res) {
    GroupModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.groupId)
    }, function(err, group) {
        res.send(group);
    });
};

/* Get Dashboards referenced to Group 
 */
var getDashboardsByGroupId = function(req, res) {
    DashboardModel.find({
        "groups": {
            $elemMatch: {
                _id: mongoose.Types.ObjectId(req.params.groupId)
            }
        }
    }, function(err, dashboards) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(dashboards);
        }
    });
};

/* Get Cards referenced to Group 
 */
var getCardsByGroupId = function(req, res) {
    CardModel.find({
        "groups": {
            $elemMatch: {
                _id: mongoose.Types.ObjectId(req.params.groupId)
            }
        }
    }, function(err, cards) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(cards);
        }
    });
};

/* Get Datasources referenced to Group 
 */
var getDatasourcesByGroupId = function(req, res) {
    DatasourceModel.find({
            groups: {
                $elemMatch: {
                    _id: mongoose.Types.ObjectId(req.params.groupId)
                }
            }
        },
        function(err, datasources) {
            async.each(datasources, extendDatasourceObject, function(err, datasource) {
                if (err) {
                    console.log(err);
                    res.send(err);
                } else {
                    res.send(datasources);
                }
            });
        });
}


/* Get Members referenced to Group 
 */
var getMembersByGroupId = function(req, res) {
    var userIds = [];
    var roleIds = [];
    var tempRoles = {};
    var tempUsers = {};

    GroupModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.groupId)
    }, {
        _id: 0,
        members: 1,
    }, function(err, group) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            if (group) {
                if (group.members) {
                    users = group.members.map(function(member) {
                        return member.users_id;
                    });
                }
                if (group.members) {
                    roles = group.members.map(function(member) {
                        return member.role_id;
                    });
                }
                async.parallel([
                    function(callback) {
                        //get roles related to group users
                        RoleModel.find({
                            _id: {$in: 
                                roles
                            }, 
                            group_id: req.params.groupId
                        }, function (err, roles){
                            if (err) {
                                callback(err);
                            } else {
                                tempRoles = roles;
                                callback();
                            }
                        });
                    }, function (callback) {
                        UserModel.find({
                            "_id": {
                                $in: users
                            }
                        }, {
                            password: 0
                        }, function(err, users) {
                            if (err) {
                                callback(err);
                            } else {
                                tempUsers = users;
                                callback();
                            }
                        });
                    }
                ], function(err) {
                    if(err) {
                        console.log(err);
                        res.send(err);
                    } else {

                        for (var i = 0; i < group.members.length; i++) {
                            var rl = tempRoles.filter(function(item) { return item._id == group.members[i].role_id.toString(); });
                            var usr = tempUsers.filter(function(item) { return item._id == group.members[i].users_id.toString(); });
                            
                            if (rl && usr && rl.length > 0 && usr.length > 0) {
                                usr[0].role = rl[0];
                            } else {
                                usr[0].role = {};
                            }
                        };
                        res.send(tempUsers);
                    }
                });
            } else {
                console.log("No group found for group_id=" + req.params.groupId);
                res.send("No group found for group_id=" + req.params.groupId);
            }
        }
    })
};

var getGroupReferencesByGroupId = function(req, res) {
    var responseResult = {};
    var groupId = req.params.groupId;
    
    async.parallel(
        [
            function(callback) {
                //get dashboards
                DashboardModel.find({
                    "groups": {
                        $elemMatch: {
                            _id: mongoose.Types.ObjectId(groupId)
                        }
                    }
                }, function(err, dashboards) {
                    if (err) {
                        responseResult.dashboards = err;
                        callback(err);
                    } else {
                        responseResult.dashboards = dashboards;
                        callback();
                    }
                });
            },
            function(callback) {
                //get datasources
                DatasourceModel.find({
                        groups: {
                            $elemMatch: {
                                _id: mongoose.Types.ObjectId(groupId)
                            }
                        }
                    },
                    function(err, datasources) {
                        async.each(datasources, extendDatasourceObject, function(err, datasource) {
                            if (err) {
                                responseResult.datasources = err;
                                callback(err);
                            } else {
                                responseResult.datasources = datasources;
                                callback();
                            }
                        });
                    });

            },
            function(callback) {
                //get card
                CardModel.find({
                        "groups": {
                            $elemMatch: {
                                _id: mongoose.Types.ObjectId(groupId)
                            }
                        }
                    }, 
                    function(err, cards) {
                        if (err) {
                            responseResult.cards = err;
                            callback(err);
                        } else {
                            responseResult.cards = cards;
                            callback();
                        }
                    }
                );
            },
            function(callback) {
                //get members
                var users = [];

                GroupModel.findOne({
                        _id: groupId
                    }, {
                        _id: 0,
                        members: 1,
                    }, function(err, group) {
                        if (err) {
                            responseResult.members = err;
                            callback(err);
                        } else {
                            if (group) {
                                if (group.members) {
                                    users = group.members.map(function(member) {
                                        return member.users_id;
                                    });
                                }

                                UserModel.find({
                                        "_id": {
                                            $in: users
                                        }
                                    }, {
                                        password: 0
                                    }, function(err, users) {
                                        if (err) {
                                            responseResult.members = err;
                                            callback(err);
                                        } else {
                                            responseResult.members = users;
                                            callback();
                                        }
                                    }
                                );
                        } else {
                            console.log("No group found for group_id=" + groupId);
                            responseResult.members = {error: "No group found for group_id=" + groupId};
                            callback({error: "No group found for group_id=" + groupId});
                        }
                    }
                });
            }
        ],
        function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send(responseResult);
            }
        }
    );
}



var createGroup = function(req, res) {
    var defaultThemeName = 'Grid Light';
    req.body.created_on = new Date();
    req.body.modified_on = new Date();

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            ThemeModel.findOne({
                name: defaultThemeName
            }).exec(function(err, theme) {
                if (err) {
                    return res.status(400).send(err);
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

                        req.body.members = [];
                        req.body.settings = {
                            themes: {
                                card: theme._id,
                                dashboard: theme._id
                            }
                        }
                        var group = new GroupModel(req.body);

                        GroupModel.find({
                            name: req.body.name
                        }, function(err, groups) {
                            if (groups.length > 0) {
                                res.send({
                                    errorCode: 201,
                                    errorMessage: 'You already have a group with this name.'
                                });
                            } else {
                                group.save(function(err, newGroup) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        //create admin and publisher defauls roles
                                        var roleBody = {
                                            group_id: newGroup._id,
                                            created_by: {
                                                "_id": user._id,
                                                "first_name": user.first_name,
                                                "last_name": user.last_name,
                                                "email": user.email
                                            },
                                            modified_by: {
                                                "_id": user._id,
                                                "first_name": user.first_name,
                                                "last_name": user.last_name,
                                                "email": user.email
                                            },
                                            modified_on: new Date(),
                                            created_on: new Date()
                                        };
                                        var count = 0;
                                        var admItem = {
                                            name: "admin",
                                            roleBody: roleBody
                                        };
                                        var pubItm = {
                                            name: "publisher",
                                            roleBody: roleBody
                                        };
                                        async.each([admItem, pubItm], addDefaultRoles, function(err) {
                                            if (err) {
                                                console.log(err);
                                                res.send(err);
                                            } else {

                                                GroupModel.findOne(newGroup._id).exec(function (err, group) {

                                                    if (err) {
                                                        return res.send(200, err);
                                                    }

                                                    group.members = [{
                                                        users_id: user._id,
                                                        role_id: admItem.roleId
                                                    }];

                                                    group.save(function (err, savedGroup) {

                                                        if (err) {
                                                            return res.send(200, err);
                                                        }

                                                        GroupsUtils.setRoles([savedGroup], user, function (err, groups) {

                                                            if (err) {
                                                                return res.send(200, err);
                                                            }

                                                            res.send(200, groups[0]);
                                                        });
                                                    });
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        res.send('Can not find auth0 user in database');
                    }
                }
            })
        }
    });
};

var createRefGroupToDashboard = function(req, res) {
    var groupId = req.body.group_id;
    var dashboardId = req.body.dashboard_id;
    var permissionId = req.body.permission_id;

    DashboardModel.findOne({
            _id: mongoose.Types.ObjectId(dashboardId),
            groups: {
                $elemMatch: {
                    _id: mongoose.Types.ObjectId(groupId)
                }
            }
        },
        function(err, dashboard) {
            if (err) {
                console.log(err);
            } else {
                if (dashboard) {
                    res.send("Reference already exists.");
                } else {
                    DashboardModel.update({
                            _id: mongoose.Types.ObjectId(dashboardId)
                        }, {
                            $push: {
                                groups: {
                                    _id: mongoose.Types.ObjectId(groupId),
                                    permission_id: mongoose.Types.ObjectId(permissionId)
                                }
                            }
                        },
                        function(err, updated) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("success");
                            }
                        }
                    );
                }
            }

        }
    );

}

var createRefGroupToDatasource = function(req, res) {
    var gtds = new GroupToDataSourceModel(req.body);

    gtds.save(function(err, newgtds) {
        if (err) {
            console.log(err);
        } else {
            res.jsonp(newgtds);
        }
    });
};


var createRefGroupToMember = function(req, res) {
    var groupId = req.body.group_id;
    var memberId = req.body.member_id;
    var roleId = req.body.role_id;

    GroupModel.findOne({
            _id: mongoose.Types.ObjectId(groupId),
            members: {
                $elemMatch: {
                    users_id: mongoose.Types.ObjectId(memberId)
                }
            }
        },
        function(err, group) {
            if (err) {
                console.log(err);
            } else {
                if (group) {
                    res.send("The Reference Group to Member already exists.");
                } else {
                    GroupModel.update({
                            _id: mongoose.Types.ObjectId(groupId)
                        }, {
                            $push: {
                                members: {
                                    users_id: mongoose.Types.ObjectId(memberId),
                                    role_id: mongoose.Types.ObjectId(roleId)
                                }
                            }
                        },
                        function(err, updated) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("success");
                            }
                        }
                    );
                }
            }

        }
    );
}

//object format: {group_id:"sdfsdfdsf", member_ids: ["sdfsdfdsf","sdfsdf"]}
var deleteRefGroupToMember = function(req, res) {
    var groupId = req.params.groupId;
    var members = req.params.memberIds.split(","); 

    async.each(
        members, 
        function (memberId, callback) {
            if (memberId && memberId.length > 0) {
                GroupModel.update({
                    _id: mongoose.Types.ObjectId(groupId)
                }, {
                    $pull: {
                        members: {
                            users_id: mongoose.Types.ObjectId(memberId)
                        }
                    }
                },
                function(err, updated) {
                    if (err) {
                        console.log(err);
                    } else {
                        if (updated == 0)
                        {
                            callback({err: "Reference does not exists group_id=" + groupId + " member_id=" + memberId});
                        }
                        callback();
                    }
                });
            } else {
                callback({err: "Incorrect memberId was found."});
            }
        },
        function(err) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                res.send("success");
            }
        }
    );
};

var deleteGroupById = function(req, res) {
    RoleModel.remove({
        group_id: mongoose.Types.ObjectId(req.params.groupId)
    }, function(err, deleted) {
        if (err) {
            console.log(err);
        } else {
            GroupModel.remove({
                _id: mongoose.Types.ObjectId(req.params.groupId)
            }, function(err, deleted) {
                if (err) {
                    console.log(err);
                } else {
                    res.send("success");
                }
            });
        }
    });
};

var deleteRefGroupToDashboard = function(req, res) {
    var groupId = req.body.group_id;
    var dashboardId = req.body.dashboard_id;

    DashboardModel.findOne({
            _id: mongoose.Types.ObjectId(dashboardId),
            groups: {
                $elemMatch: {
                    _id: mongoose.Types.ObjectId(groupId)
                }
            }
        },
        function(err, dashboard) {
            if (err) {
                console.log(err);
            } else {
                if (!dashboard) {
                    res.send("Reference does not exists.");
                } else {
                    DashboardModel.update({
                            _id: mongoose.Types.ObjectId(dashboardId)
                        }, {
                            $pull: {
                                groups: {
                                    _id: mongoose.Types.ObjectId(groupId)
                                }
                            }
                        },
                        function(err, updated) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send("success");
                            }
                        }
                    );
                }
            }
        }
    );
};

//Update Group call.
//users_id field can not be updated here, use createRef/deleteRef calls
var updateGroup = function(req, res) {
    var groupBody = req.body;
    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                groupBody.modified_by = {
                    "_id": user._id,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email
                };

                GroupModel.updateGroup(groupBody, function(err, group) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(group);
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
};

var updateRefGroupToMember = function(req, res) {
    var groupId = req.body.group_id;
    var memberId = req.body.member_id;
    var roleId = req.body.role_id;
    var firstName = req.body.first_name;
    var lastName = req.body.last_name;
    var email = req.body.email;

    async.parallel([function(callback) {
        GroupModel.update({
                _id: mongoose.Types.ObjectId(groupId),
                "members.users_id": mongoose.Types.ObjectId(memberId)
            }, {
                $set: {
                    "members.$.role_id": mongoose.Types.ObjectId(roleId)
                }
            },
            function(err, updated) {
                if (err) {
                    callback(err);
                } else {
                    if (updated > 0)
                        callback();
                    else
                        callback("No group.member was updated");
                }
            }
        );
    },
    function(callback) {
        UserModel.findOneAndUpdate({_id: memberId},
        {
            $set: 
            {
                first_name: firstName,
                last_name: lastName,
                email: email
            }
        },
        function(err, user) {
            if (err) {
                callback(err);
            } else {
                if (user)
                    callback();
                else
                    callback("No user was updated");
            }
        });
    }],
    function(err) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.send("success");
        }
    });
}

var extendDatasourceObject = function(datasource, callback) {
    if (datasource.dataIntegrationId && datasource.accountId) {
        async.parallel([
                function(callbackinner) {
                    DataIntegrationModel.findOne({
                        _id: datasource.dataIntegrationId
                    }, function(err, dataIntegration) {
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
                    AccountModel.findOne({
                        _id: datasource.accountId
                    }, function(err, account) {
                        if (err) {
                            callbackinner(err);
                        } else {
                            if (account) {
                                datasource.account = account;
                                callbackinner();
                            } else {
                                callbackinner(new Error("Can not find Account wit _id = " + datasource.accountId));
                            }
                        }
                    });
                }
            ],
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

function addDefaultRoles(roleItem, callback) {
    var roleBody = roleItem.roleBody;
    if (roleItem.name == "admin") {
        var defaultAdmin = {
            group_id: roleBody.group_id,
            modified_on: roleBody.modified_on,
            created_on: roleBody.created_on,
            created_by: roleBody.created_by,
            modified_by: roleBody.modified_by,
            name: 'admin',
            editable: false,
            access: [{
                name: 'Dashboards',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Datasources',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Cards',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Members',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Settings',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }]
        };

        var role = new RoleModel(defaultAdmin);
        role.save(function(err, role) {
            if (err) {
                callback(err);
            } else {
                roleItem.roleId = role._id;
                callback();
            }
        });
    } else if (roleItem.name == "publisher") {
        var defaultPublisher = {
            group_id: roleBody.group_id,
            modified_on: roleBody.modified_on,
            created_on: roleBody.created_on,
            created_by: roleBody.created_by,
            modified_by: roleBody.modified_by,
            name: 'publisher',
            editable: true,
            access: [{
                name: 'Dashboards',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Datasources',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Cards',
                permissions: [{
                    name: 'View',
                    enabled: true
                }, {
                    name: 'Create',
                    enabled: true
                }, {
                    name: 'Edit',
                    enabled: true
                }, {
                    name: 'Delete',
                    enabled: true
                }]
            }, {
                name: 'Members',
                permissions: [{
                    name: 'View',
                    enabled: false
                }, {
                    name: 'Create',
                    enabled: false
                }, {
                    name: 'Edit',
                    enabled: false
                }, {
                    name: 'Delete',
                    enabled: false
                }]
            }, {
                name: 'Settings',
                permissions: [{
                    name: 'View',
                    enabled: false
                }, {
                    name: 'Create',
                    enabled: false
                }, {
                    name: 'Edit',
                    enabled: false
                }, {
                    name: 'Delete',
                    enabled: false
                }]
            }]
        };

        var role = new RoleModel(defaultPublisher);
        role.save(function(err, role) {
            if (err) {
                callback(err);
            } else {
                callback();
            }
        });
    }
};

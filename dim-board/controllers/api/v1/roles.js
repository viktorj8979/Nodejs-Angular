/** 
 * Role API calls
 */

var RoleModel = require('../../../models/role'),
    UserModel = require('../../../models/user'),
    mongoose = require('mongoose');

module.exports = function(router) {
    router.get('/api/v1/roles/groups/:groupId', getRoleByGroupId);
    router.get('/api/v1/roles/:roleId', getRoleById);
    router.post('/api/v1/roles', createRole);
    router.put('/api/v1/roles', updateRole);
    router.delete('/api/v1/roles/:roleId', deleteRoleById);
};

var getRoleByGroupId = function(req, res) {
    RoleModel.find({group_id : mongoose.Types.ObjectId(req.params.groupId) },function(err, roles) {
        if (err) {
            console.log(err);
        } else {
            res.send(roles);
        }
    });
};

var getRoleById = function(req, res) {
    RoleModel.findOne({_id : mongoose.Types.ObjectId(req.params.roleId) },function(err, role) {
        if (err) {
            console.log(err);
        } else {
            res.send(role);
        }
    });
};

var createRole = function(req, res) {
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

            var role = new RoleModel(req.body);

            role.save(function(err, newRole) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(newRole);
                }
            });
        } else {
            res.send('Can not find auth0 user in database');
        }
    });
};

var deleteRoleById = function(req, res) {
    RoleModel.remove({_id: mongoose.Types.ObjectId(req.params.roleId)}, function(err, role) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
};

var updateRole = function(req, res) {
    var roleBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                roleBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };

                RoleModel.updateRole(roleBody, function(err, role) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(role);
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}
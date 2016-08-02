var UserModel = require('../../../models/user');
var gravatar = require('gravatar'),
    util =require("util");
    
module.exports = function(router) {

    router.get('/api/v1/users', getAllUsers);
    router.post('/api/v1/users', createUser);
    router.get('/api/v1/users/:userId', getUserById);
    //router.get('/api/v1/users/:username', getUserByUsername);
    router.delete('/api/v1/users/:userId', deleteUserById);
    router.put('/api/v1/users', updateUser);
};

var getAllUsers = function(req, res) {
    UserModel.find(function(err, users) {
        res.send(users);
    });
}

var createUser = function(req, res) {
    req.body.created_on = new Date();
    req.body.modified_on = new Date();

    req.body.picture = req.body.picture || gravatar.url(req.body.email, {s: '100', r: 'x', d: 'retro'}, true);

    var user = new UserModel(req.body);

    UserModel.find({name: req.body.name},function(err, users) {
        if(users.length > 0) {
            res.send({
                errorCode: 201,
                errorMessage: 'You already have a user with this name.'
            });
        } else {
            user.save(function(err, newUser) {
                if (err) {
                    console.log(err);
                } else {
                    res.send(newUser);
                }
            });
        }
    });
}

var getUserById = function(req, res) {
    UserModel.findOne({_id : req.params.userId },function(err, user) {
        res.send(user);
    });
}

var getUserByUsername = function(req, res) {
    UserModel.findOne({login : req.params.username },function(err, user) {
        res.send(user);
    });
}

var deleteUserById = function(req, res) {
    UserModel.remove({_id: req.params.userId}, function(err, user) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}

var updateUser = function(req, res) {
    var userBody = req.body;
    
    UserModel.updateUser(userBody, function(err, updated) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.jsonp("success");
        }
    });
}

var updateUserAndRole = function(req, res) {
    var userBody = req.body;

    UserModel.updateuser(userBody, function(err, updated) {
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            res.jsonp("success");
        }
    });

}
var ThemeModel = require('../../../models/theme'),
    common_util = require('../../../lib/common_util'),
    UserModel = require('../../../models/user'),
    mongoose = require('mongoose');

module.exports = function(router) {
    router.post('/api/v1/themes', createTheme);
    router.get('/api/v1/themes/:themeId', getThemeById);
    router.get('/api/v1/themes/group/:groupId', getThemeByGroupId);
    router.get('/api/v1/themes/dashboard/:themeId', getDashboardThemeById);
    router.get('/api/v1/themes/chart/:themeId', getChartThemeById);
    router.get('/api/v1/themes/table/:themeId', getTableThemeById);
    router.delete('/api/v1/themes/:themeId', deleteThemeById);
    router.put('/api/v1/themes', themeUpdate);
};

var getThemeByGroupId = function(req, res) {
    ThemeModel.find({ $or:[{group_id: 'default'}, {group_id: req.params.groupId}] },function(err, themes) {
        if (err) {
            console.log(err);
        } else {
            res.send(themes);
        }
    });
};


var createTheme = function(req, res) {
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
                //create ObjectId for group_id (group_id value comes from client as string)
                if (req.body.group_id && common_util.isObjectId(req.body.group_id)) {
                    req.body.group_id = mongoose.Types.ObjectId(req.body.group_id);
                }

                var theme = new ThemeModel(req.body);

                ThemeModel.find({name: req.body.name, group_id: req.body.group_id}, function(err, themes) {
                    if(themes.length > 0) {
                        res.send({
                            errorCode: 201,
                            errorMessage: 'Current group already has a theme with such name.'
                        });
                    } else {
                        theme.save(function(err, newTheme) {
                            if (err) {
                                console.log(err);
                            } else {
                                res.send(newTheme);
                            }
                        });
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}

var getThemeById = function(req, res) {
    ThemeModel.findOne({ _id: mongoose.Types.ObjectId(req.params.themeId) },function(err, themes) {
        res.send(themes);
    });
}

var getDashboardThemeById = function(req, res) {

}

var getChartThemeById = function(req, res) {

}

var getTableThemeById = function(req, res) {

}


var deleteThemeById = function(req, res) {
    ThemeModel.remove({ _id: mongoose.Types.ObjectId(req.params.themeId) },function(err, deleted) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
}


var themeUpdate = function(req, res) {
    var themeBody = req.body;

    //create ObjectId for group_id (group_id value comes from client as string)
    if (themeBody.group_id && common_util.isObjectId(themeBody.group_id)) {
        themeBody.group_id = mongoose.Types.ObjectId(themeBody.group_id);
    }

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                themeBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };

                ThemeModel.updateTheme(themeBody, function(err, updated) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp("success");
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}


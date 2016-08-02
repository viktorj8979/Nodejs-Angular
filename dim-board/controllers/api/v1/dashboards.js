/** 
 * Dashboard API calls
 */

var DashboardModel = require('../../../models/dashboard');
var ImageUtils = require('../Utils/ImageUtils.js');
var UserModel = require('../../../models/user');
var mongoose = require('mongoose');


module.exports = function(router) {

    router.get('/api/v1/dashboards', getAllDashboards);
    router.get('/api/v1/dashboards/:dashboardId', getDashboardById);
    router.get('/api/v1/dashboards/group/:dashboardId', getGroupsByDashboardId);
    router.post('/api/v1/dashboards', createDashboard);
    router.put('/api/v1/dashboards', updateDashboard);
    router.delete('/api/v1/dashboards/:dashboardId', deleteDashboardById);
};

var getAllDashboards = function(req, res) {
    DashboardModel.find(function(err, dashboards) {
        res.jsonp(dashboards);
    });
}

/** This call allow to create a new Dashboard object
 * @param dashboard object: {group_id: string, file_id: string, title: string, data: array, created_by: string, modified_by: string}
 *
 */
var createDashboard = function(req, res) {
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

                var dashboard = new DashboardModel(req.body);

                dashboard.save(function(err, newdashboard) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.jsonp(newdashboard);
                    }
                }); 
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });                   
}

var getDashboardById = function(req, res) {
    DashboardModel.findOne({
        _id: req.params.dashboardId
    }, function(err, dashboard) {
        res.jsonp(dashboard);
    });
}

var getGroupsByDashboardId = function(req, res) {
    DashboardModel.find({
        group_id: req.params.group_id
    }, function(err, dashboards) {
        res.jsonp(dashboards);
    });
}

var deleteDashboardById = function(req, res) {
    req.params.dashboardId.split(",").forEach(function(dId) {
        if (dId.trim()) {
            DashboardModel.remove({_id: dId}, function(err, removedcount) {
                if(err) {
                    console.log(err);
                } else {
                    res.send("success");
                }
            });
        }
    });
}

var updateDashboard = function(req, res) {
    var dashboardId = req.body._id;
    var dashboardBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            if (user) {
                dashboardBody.modified_by = {
                    "_id": user._id, 
                    "first_name": user.first_name, 
                    "last_name": user.last_name,
                    "email": user.email
                };

                DashboardModel.updateDashboard(dashboardBody, function(err, dashboard) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('test *****************d')
                        ImageUtils.generateThumbnail(dashboardBody._id, function(test) {
                            console.log(test);
                            res.jsonp(dashboard);
                        });
                    }
                });
            } else {
                res.send('Can not find auth0 user in database');
            }
        }
    });
}


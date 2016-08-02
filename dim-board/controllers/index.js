'use strict';


var IndexModel = require('../models/index'),
    auth = require('../lib/auth'),
    app = require('express')();


module.exports = function (router) {

    var indexmodel = new IndexModel();

    router.get('/', function (req, res) {
        res.render('index', indexmodel);
    });

    router.get('/integrations', function (req, res) {
        res.render('integrations', indexmodel);
    });

    router.get('/pricing', function (req, res) {
        res.render('pricing', indexmodel);
    });

    router.get('/app', function (req, res) {
        res.render('backIndex', indexmodel);
    });

    router.get('/env', function (req, res) {
        res.jsonp(app.settings.env);
    });

};

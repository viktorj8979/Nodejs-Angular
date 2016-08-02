'use strict';


var kraken = require('kraken-js'),
    express = require('express'),
    app = express(),
    jwt = require('express-jwt'),
    options = require('./lib/spec')(app),
    userLib = require('./lib/user')(),
    port = process.env.PORT || 8080,
    fs = require('fs'),
    https = require('https'),
    util = require('util'),
    gravatar = require('gravatar'),
    UserModel = require('./models/user');

//express-jwt's configuration
var jwtCheck = jwt({
  secret: new Buffer('S-vSx5IVUNTDbToZOkHKZKCrnP2kao5TopV9bT7Sci72-pmP6lVRmW3JpdZJjKMJ', 'base64'),
  audience: 'ODdHSypfq5EhGUxQ87vPyc55T8Dnbeqc',
  getToken: function fromHeaderOrQuerystring (req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        req['token'] = req.headers.authorization.split(' ')[1];
        return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
        req['token'] = req.query.token;
        return req.query.token;
    }
    return null;
  }
});

//protect our API from authenticated requests
app.use('/api', jwtCheck);
app.get('/api/v1/usersession', function (req, res) {
    var jsonObj = JSON.stringify({"id_token": req.token});
    var postHeads = {"Content-Type": "application/json", "Content-Length": Buffer.byteLength(jsonObj, "utf8")};
    var postOptions = {
        host: "alvara.auth0.com",
        port: 443,
        path: "/tokeninfo",
        method: "POST",
        headers: postHeads
    };
    var reqPost = https.request(postOptions, function (response) {
        var content = "";
        response.on("data", function(data) {
            content += data;
        });
        response.on("end", function() {
            var resObj = JSON.parse(content);
            if (resObj) {
                var auth0user_id = resObj.user_id;
                var nickname = resObj.nickname;
                var identity = resObj.identities[0]; 
                var email = auth0user_id;
                if (resObj.email)
                    email = resObj.email;
                var picture = null;
                if (resObj.picture)
                    picture = resObj.picture;
                UserModel.getUserByAuth0Id(auth0user_id, function(err, user) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (user) {
                            res.send(user);
                        } else {
                            if (identity.isSocial) {
                                var email = auth0user_id;
                                if (identity.email)
                                    email = identity.email;
                                    picture = picture || gravatar.url(email, {s: '400', r: 'x', d: 'retro'}, true);
                                var usr = new UserModel({auth0id: auth0user_id, picture: picture,
                                    email: email, username: nickname});
                                usr.save(function(err, user) {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        res.send(user);
                                    }
                                });
                            } else {
                                var user_id = identity.user_id;
                                UserModel.findOne({_id: user_id}, function(err, user) {
                                    if (user) {
                                        if (!user.auth0id !== auth0user_id) {
                                            user.auth0id = auth0user_id;
                                            user.picture = gravatar.url(user.email, {s: '100', r: 'x', d: 'retro'}, true);
                                            user.save(function(err, usr) {
                                                if (err) {
                                                    console.log(err);
                                                } else {
                                                    res.send(usr);
                                                }
                                            })
                                        } else {
                                            res.send(user);
                                        }
                                    } else {
                                        console.log("Incorrect user");
                                        throw new Error("Incorrect user");
                                    }
                                });
                            }
                        }
                    }
                });
            }
        });

    });

    // write the json data
    reqPost.write(jsonObj);
    reqPost.end();
    reqPost.on('error', function(e) {
        console.error(e);
        res.send("error");
    })
});
app.use(express.static(__dirname + '/public'));
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


var routePath = "./controllers/api/v1/";
fs.readdirSync(routePath).forEach(function(file) {
    var route = routePath + file.replace('.js', '');
    require(route)(app);
});

app.use(kraken(options));

//add error handling
app.use(function(err, req, res, next){
    if (err) {
        console.log(util.inspect(err, true, null));
        if (err.constructor.name === 'UnauthorizedError') {
            res.status(401).send('Unauthorized');
        } else {
            res.status(err.statusCode).send(err);
        }
    }
});


app.listen(port, function(err) {
    console.log('[%s] Listening on http://localhost:%d', app.settings.env, port);
});
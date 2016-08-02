'use strict';

var User = require('../models/user');

var UserLibrary = function() {
    return {
        addUsers: function() { //add two users
            var u1 = new User({
              tenant: "alvara",
              client_id: "",
              connection: "dim-dev",
              email: "kraken@gmail.com",
              password: "kraken",
              username: "kraken"
            });

            var u2 = new User({
              tenant: "alvara",
              client_id: "",
              connection: "dim-dev",
              email: "ash@gmail.com",
              password: "ash",
              username: "ash"
            });

            //Ignore errors. In this case, the errors will be for duplicate keys as we run this app more than once.
            u1.save();
            u2.save();
        },
        serialize: function(user, done) {
            done(null, user.id);
        },
        deserialize: function(id, done) {
            User.findOne({
                _id: id
            }, function(err, user) {
                done(null, user);
            });
        }
    };
};

module.exports = UserLibrary;
/** 
 * Account API calls
 */

var AccountModel = require('../../../models/account'),
    UserModel = require('../../../models/user'),
    mongoose = require('mongoose');

module.exports = function(router) {
    router.get('/api/v1/accounts/:accountId', getAccountById);
    router.get('/api/v1/accounts/group/:groupId', getAccountsByGroupId);
    router.post('/api/v1/accounts', createAccount);
    router.put('/api/v1/accounts', updateAccount);
    router.delete('/api/v1/accounts/:accountId', deleteAccount);
};

/* Get Account by id 
 * It should consider whether to return all references in this call
 */
var getAccountById = function(req, res) {
    AccountModel.findOne({
        _id: mongoose.Types.ObjectId(req.params.accountId)
    }, function(err, account) {
        if (err)
            console.log(err);
        else
            res.jsonp(account);
    });
}

/* Get Accounts by group id 
 */
var getAccountsByGroupId = function(req, res) {
    AccountModel.find({
        group_id: req.params.group_id
    }, function(err, accounts) {
        res.jsonp(accounts);
    });
}

/** This call allow to create a new Account object
 * @param account object: {group_id: string, file_id: string, title: string, data: array, created_by: string, modified_by: string}
 *
 */
var createAccount = function(req, res) {
    req.body.created_on = new Date();
    req.body.modified_on = new Date();

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        }
        else {
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

            var account = new AccountModel(req.body);

            account.save(function(err, newaccount) {
                if (err) {
                    console.log(err);
                } else {
                    res.jsonp(newaccount);
                }
            }); 
        }
    });                   
}

/* upate account call */
var updateAccount = function(req, res) {
    var userToken = req.user;
    var accountBody = req.body;

    UserModel.getUserByAuth0Id(req.user.sub, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            accountBody.modified_by = {
                "_id": user._id, 
                "first_name": user.first_name, 
                "last_name": user.last_name,
                "email": user.email
            };
            accountBody.modified_on = new Date();

            AccountModel.updateAccount(accountBody, function(err, account) {
                if (err) {
                    console.log(err);
                } else {
                    res.jsonp(account);
                }
            });
        }
    });
}

var deleteAccount = function(req, res) {
    AccountModel.remove({_id: mongoose.Types.ObjectId(req.params.accountId)}, function(err, deleted) {
        if(err) {
            console.log(err);
        } else {
            res.send("success");
        }
    });
};

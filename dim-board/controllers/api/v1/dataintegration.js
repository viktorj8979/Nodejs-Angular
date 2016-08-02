/** 
 * DataIntegration API calls
 */

var DataIntegration = require('../../../models/dataintegration'),
	UserModel 		= require('../../../models/user');

module.exports = function(router) {
    router.get('/api/v1/dataintegrations', getAllDataIntegrations);
};

var getAllDataIntegrations = function(req, res) {

	DataIntegration.find({}).exec(function (err, integrations) {

		if (err) {
			return res.send(400, err);
		}

		res.status(200).send(integrations);
	});
}
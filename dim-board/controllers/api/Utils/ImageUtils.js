var webshot = require('webshot');

module.exports = {
	generateThumbnail: generateThumbnail
};

var generateThumbnail = function(dashboardID, cb) {
	var url = 'http://localhost:8080/app/#/dashboard/' + dashboardID;
	var destUrl = '/backApp/assets/img/dashboard/dashboard';

	console.log(' * page url ', url);
	console.log(' * image dest url ', destUrl);

    webshot(url, destUrl + dashboardId + '.png', function(err) {
    	cb();
    });
}
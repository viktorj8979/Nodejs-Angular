angular.module('common', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('common').config(function($stateProvider) {

    $stateProvider.state('common', {
        url: '/get-first-group',
        templateUrl: '../backApp/common/partial/common.first/common.first.html',
        data: { requiresLogin: true }
    });
    /* Add New States Above */

});


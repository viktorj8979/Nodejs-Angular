angular.module('settings', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'ct.ui.router.extras']);

angular.module('settings').config(function($stateProvider, $futureStateProvider) {
    var stateName = 'Settings';

    $futureStateProvider.addResolve(['Permissions', function (Permissions) {
        Permissions.addState({
            name: stateName,
            init: stateInitialize
        });
    }]);

    function stateInitialize() {
        $stateProvider.state('settings', {
            abstract: true,
            url: "/",
            templateUrl: "../backApp/common/partial/common.layout/common.layout.html"
        });
        $stateProvider.state('settings.config', {
            url: "settings",
            templateUrl: "../backApp/settings/partial/settings.config/settings.config.html",
            data: { requiresLogin: true }
        });
    }

});


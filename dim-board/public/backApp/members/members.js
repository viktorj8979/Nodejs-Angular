angular.module('members', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'ct.ui.router.extras']);

angular.module('members').config(function($stateProvider, $futureStateProvider) {
    var stateName = 'Members';

    $futureStateProvider.addResolve(['Permissions', function (Permissions) {
        Permissions.addState({
            name: stateName,
            init: stateInitialize
        });
    }]);

    function stateInitialize() {
        $stateProvider.state('members', {
            abstract: true,
            url: "/",
            templateUrl: "../backApp/common/partial/common.layout/common.layout.html"
        });
        $stateProvider.state('members.list', {
            url: "members",
            templateUrl: "../backApp/members/partial/members.list/members.list.html",
            data: { requiresLogin: true }
        });
    }
});
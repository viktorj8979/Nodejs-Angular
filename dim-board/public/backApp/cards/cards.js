angular.module('cards', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'ct.ui.router.extras']);

angular.module('cards').config(function($stateProvider, $futureStateProvider) {
    var stateName = 'Cards';

    $futureStateProvider.addResolve(['Permissions', function (Permissions) {
        Permissions.addState({
            name: stateName,
            init: stateInitialize
        });
    }]);

    function stateInitialize() {

        $stateProvider.state('cards', {
            abstract: true,
            url: "/",
            templateUrl: "../backApp/common/partial/common.layout/common.layout.html"
        });
        $stateProvider.state('cards.list', {
            url: "cards",
            templateUrl: "../backApp/cards/partial/cards.list/cards.list.html",
            data: { requiresLogin: true }
        });
        $stateProvider.state('cards.create', {
            url: 'cards/:id',
            templateUrl: '../backApp/cards/partial/cards.create/cards.create.html',
            data: { requiresLogin: true }
        });
    }
});


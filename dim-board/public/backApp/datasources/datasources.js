(function(){
'use strict';

angular
	.module('datasources', ['ui.bootstrap','ui.utils','ui.router','ngAnimate', 'ngDropzone', 'ct.ui.router.extras'])
	.config(['$stateProvider', '$futureStateProvider',
        function($stateProvider, $futureStateProvider) {
            var stateName = 'Datasources';

            $futureStateProvider.addResolve(['Permissions', function (Permissions) {
                Permissions.addState({
                    name: stateName,
                    init: stateInitialize
                });
            }]);

            function stateInitialize() {
                $stateProvider.state('datasources', {
                    abstract: true,
                    url: "/",
                    templateUrl: "../backApp/common/partial/common.layout/common.layout.html"
                });
                $stateProvider.state('datasources.list', {
                    url: "datasources",
                    templateUrl: "../backApp/datasources/partial/datasources.list/datasources.list.html",
                    data: { requiresLogin: true }
                });
            }
    }]);

})();

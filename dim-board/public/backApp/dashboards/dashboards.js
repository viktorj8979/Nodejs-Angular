(function(){
'use strict';

angular
	.module('dashboards', ['ui.bootstrap','ui.utils','ui.router','ngAnimate','color.picker','summernote'])
	.config(function($stateProvider) {
        
        $stateProvider.state('dashboard', {
            abstract: true,
            url: "/",
            templateUrl: "../backApp/common/partial/common.layout/common.layout.html"
        });
        $stateProvider.state('dashboard.create', {
            url: "dashboard/:id",
            templateUrl: "../backApp/dashboards/partial/dashboards.create/dashboards.create.html",
            data: { requiresLogin: true }
        });
        $stateProvider.state('dashboard.list', {
            url: "dashboards",
            templateUrl: "../backApp/dashboards/partial/dashboards.list/dashboards.list.html",
            data: { requiresLogin: true }
        });
});

})();

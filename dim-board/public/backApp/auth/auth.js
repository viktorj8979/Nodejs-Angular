angular.module('auth', ['ui.bootstrap','ui.utils','ui.router','ngAnimate']);

angular.module('auth').config(function($stateProvider) {

    /* Add New States Above */
    $stateProvider
    .state('auth', {
        url: '/auth',
        template: '<div class="full-height" ui-view></div>'
    })
    .state('auth.signin', {
        url: '/login',
        templateUrl: '../backApp/auth/partial/auth.signin/auth.signin.html'
    })

});


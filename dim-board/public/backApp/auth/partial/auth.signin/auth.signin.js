(function() {
'use strict';

angular
	.module('auth')
	.controller('AuthSigninCtrl', AuthSigninCtrl);

	AuthSigninCtrl.$inject = ['$http', '$scope', '$state', '$location', 'auth', 'store', 'Groups'];

	function AuthSigninCtrl($http, $scope, $state, $location, auth, store, Groups) {
		$scope.auth = auth;
		$scope.login = login;
		$scope.connections = ['amazon'];

		init();

		function init() {
			clearSession();
			getEnv();
		}

		function clearSession() {
			auth.signout();
			store.remove('profile');
			store.remove('token');
			store.remove('user');
		};

		function getEnv() {
			$http.get('/env/').then(function(env) {
				if(env.data === "development") {
					$scope.connections.push('dim-dev');
				} else if(env.data === "test") {
					$scope.connections.push('dim-qa');
				} else if(env.data === "prod") {
					$scope.connections.push('dim-prod');
				}

				login();
			});
		}

		function login() {
			auth.signin({
				container: 'hiw-login-container',
				rememberLastLogin: false,
				connections: $scope.connections
			}, function (profile, token) {
				// Success callback
				store.set('profile', profile);
				store.set('token', token);
				getUserSession();
			}, function (error) {
				console.log(error);
			});
		};

		function getUserSession() {
			$http.get('/api/v1/usersession').then(function(user) {
				store.set('user', user.data);
				$location.path('/dashboards');
			});
		}
	}
})();
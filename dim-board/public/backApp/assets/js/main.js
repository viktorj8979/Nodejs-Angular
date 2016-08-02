/* ============================================================
 * File: main.js
 * Main Controller to set global scope variables. 
 * ============================================================ */

angular.module('dim')
    .controller('AppCtrl', AppCtrl); 

AppCtrl.$inject = ['$scope', '$rootScope', '$state', '$modal', '$location', 'store', '$ocLazyLoad', 'auth', 'Groups', 'Permissions'];

function AppCtrl($scope, $rootScope, $state, $modal, $location, store, $ocLazyLoad, auth, Groups, Permissions) {
    // App globals
    $scope.auth = auth;
    /** Get logged in user **/
    $scope.user = {};
    /** Groups the user is a member of. */
    $scope.groups = Groups.list();
    /** Dashboards the group has permission to access. */
    $scope.dashboards = Groups.dashboards();
    /** Datasources the group has permission to access. */
    $scope.cards = Groups.cards();
    /** Datasources the group has permission to access. */
    $scope.datasources = Groups.datasources();
    /** Members that have access to group. */
    $scope.members = Groups.members();
    /** Group the user is currently viewing. */
    $scope.selectedGroup = Groups.selectedGroup();
    /* Create card using this datasource */
    $scope.useDatasourceToCreateCard = {};
    /* Get group dashboards */
    $scope.getDashboards = getDashboards;
    /* Get group datasources */
    $scope.getDatasources = getDatasources;
    /* Get group cards */
    $scope.getCards = getCards;
    /* Get group members */
    $scope.getMembers = getMembers;
    /* Get groups */
    $scope.getGroups = getGroups;
    /* Get group data */
    $scope.getGroupData = getGroupData;
    /** Change the group that is being viewed. */
    $scope.selectGroup = selectGroup;

    function init() {
        getGroups();
    }

    function getGroupData() {
        $scope.getDashboards();
        $scope.getDatasources();
        $scope.getCards();
        $scope.getMembers();
    }

    function selectGroup(group) {
        $scope.selectedGroup = Groups.selectedGroup(group);
        $scope.getGroups();
    }
    
    function getGroups() {
        Groups
            .getGroups()
            .then(success, error);

        function success(groups) {
            if(groups.length > 0) {
                $scope.groups = Groups.list(groups);
                if(!hasGroup($scope.selectedGroup)) {
                    $scope.selectedGroup = Groups.selectedGroup(groups[0]);
                }
                getGroupData();
                Permissions.setPermissions($scope.groups, $scope.selectedGroup, $scope.user);
                $location.path('/dashboards');
            } else {
                $location.path('/get-first-group');
            }
        }

        function error(response) {
            console.log(response);
        }
    }

     /** 
     * @name hasGroup
     * @desc check if group is present
     * @returns {{Object}} group, group object
     */
    function hasGroup(group) {
        var hasGroup = false;

        if(_.findWhere($scope.groups, { _id: group._id })) {
            hasGroup = true;
        }
        
        return hasGroup;
    }

    function getDashboards() {
        Groups
            .getDashboardsByGroupId($scope.selectedGroup._id)
            .then(success, error);

        function success(dashboards) {
            $scope.dashboards = Groups.dashboards(dashboards);
        }

        function error(error) {
            console.log('Get group dashboards failed.', error);
        }
    }

    function getDatasources() {
        Groups
            .getDatasourcesByGroupId($scope.selectedGroup._id)
            .then(success, error);

        function success(datasources) {
            $scope.datasources = Groups.datasources(datasources);
        }

        function error(error) {
            console.log('Get group datasources failed.', error);
        }
    }

    function getCards() {
        Groups
            .getCardsByGroupId($scope.selectedGroup._id)
            .then(success, error);

        function success(cards) {
            $scope.cards = Groups.cards(cards);
        }

        function error(error) {
            console.log('Get group cards failed.', error);
        }
    }

    function getMembers() {
        Groups
            .getMembersByGroupId($scope.selectedGroup._id)
            .then(success, error);

        function success(members) {
            $scope.members = Groups.members(members);
        }

        function error(error) {
            console.log('Get group members failed.', error);
        }
    }

    $scope.app = {
        name: 'Pages',
        description: 'Admin Dashboard UI kit',
        layout: {
            menuPin: false,
            menuBehind: false,
            theme: '../backApp/pages/css/pages.css'
        },
        author: 'Revox'
    }
    // Checks if the given state is the current state
    $scope.is = function(name) {
        return $state.is(name);
    }

    // Checks if the given state/child states are present
    $scope.includes = function(name) {
        return $state.includes(name);
    }

    // Broadcasts a message to pgSearch directive to toggle search overlay
    $scope.showSearchOverlay = function() {
        $scope.$broadcast('toggleSearchOverlay', {
            show: true
        })
    }

    $scope.$watch(function() {
        return store.get('token')
    }, function(token) {
        if(token) {
            lazyLoad().then(function() {
                init();
            });
        }
    });

    $scope.$watch(function() {
        return store.get('user');
    }, function(user) {
        if(!user){
            $location.path('/');
        }
        $scope.user = $.extend($scope.user, store.get('user'));
    });

    function lazyLoad() {
        return $ocLazyLoad.load([
            'nvd3',
            'mapplic',
            'rickshaw',
            'metrojs',
            'sparkline',
            'skycons',
            'switchery'
        ], {
            insertBefore: '#lazyload_placeholder'
        });
    }

};


angular.module('dim')
    /*
        Use this directive together with ng-include to include a 
        template file by replacing the placeholder element
    */
    .directive('includeReplace', function() {
        return {
            require: 'ngInclude',
            restrict: 'A',
            link: function(scope, el, attrs) {
                el.replaceWith(el.children());
            }
        };
    });
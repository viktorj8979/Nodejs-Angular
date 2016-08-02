(function() {
	'use strict';

	angular
		.module('common')
		.controller('CommonSidebarCtrl', CommonSidebarCtrl);

	CommonSidebarCtrl.$inject = ['$scope', 'auth', 'store', '$location', '$modal'];

	function CommonSidebarCtrl($scope, auth, store, $location, $modal){
	    /** signout use */
	    $scope.signout = signout;
	    /** create a new group */
	    $scope.createGroup = createGroup;
	    /** close Side Menu */
	    $scope.closeSideMenu = closeSideMenu;
	    /** close Mobile Side Menu */
	    $scope.closeMobileSideMenu = closeMobileSideMenu;
	    /** event mouse enter sidebar */
	    $scope.mouseEnterSidebar = mouseEnterSidebar;
	    /** close Group Dropdown */
	    $scope.closeGroupDropdown = closeGroupDropdown;
	    /** close Profile dropdown*/
	    $scope.closeProfileDropdown = closeProfileDropdown;

	    var body = $('body');
	    var pageSidebar = $('.page-sidebar');
	    
	    function createGroup() {
	        $modal.open({
	            templateUrl: '../backApp/groups/modal/addGroup/addGroup.html',
	            controller: 'AddgroupCtrl'
	        }).result.then(function(group){
	            $scope.$parent.selectGroup(group);
	        });
	    }

	    function signout() {
       		$scope.$parent.$parent.$parent.selectedGroup = {};
	        auth.signout();
	        store.remove('profile');
	        store.remove('token');
	        store.remove('user');
	        $location.path('/')
	    }

	    var closingSidenav;

	    function closeSideMenu(){
	    	closingSidenav = setTimeout(function(){
	    		closeGroupDropdown();
	    		closeProfileDropdown();
	    		pageSidebar.attr('style','');
	    		body.removeClass('sidebar-visible');
	    	}, 300)
	    }

	    function mouseEnterSidebar(){
	    	clearTimeout(closingSidenav)
	    }

	    function closeGroupDropdown(){
	    	$scope.status.isopen = false;
	    }
	    function closeProfileDropdown(){
	    	$('#profile-dropdown').removeClass('open');
	    }
	    function closeMobileSideMenu($event){
    		if( $($event.target).hasClass('title') || $($event.target).hasClass('detailed')) {
    			body.removeClass('sidebar-open');
    		}
	    }
	}

})();

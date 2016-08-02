(function(){
'use strict';

angular
	.module('members')
	.controller('MembersListCtrl', MembersListCtrl);

	MembersListCtrl.$inject = ['$scope', '$state', 'SweetAlert', '$modal', '$http', 'Groups','Members'];

	/**
	 * @name MembersListCtrl
	 * @desc List member in list and grid views.
	 * @memberOf members
	 */
	function MembersListCtrl($scope, $state, SweetAlert, $modal, $http, Groups, Members) {
		$scope.loading = true;
		$scope.view = 'list';
		$scope.displayView = displayView;
		$scope.predicate = 'title';
		$scope.reverse = true;
		$scope.roles = [];
		$scope.order = order;
		$scope.selectedMembers = [];
		$scope.selected = selected;
		$scope.selectMember = selectMember;
		$scope.selectAllMembers = selectAllMembers;
		$scope.editMember = editMember;
		$scope.cancelMemberUpdate = cancelMemberUpdate;
		$scope.deleteAllSelectedMembers = deleteAllSelectedMembers;
		$scope.deleteMember = deleteMember;
		$scope.shareMember = shareMember;
		$scope.showRole = showRole;
		$scope.updateMember = updateMember;


		init();

		function showRole(id){
			for (var i = 0; i < $scope.roles.length; i++) {
				if($scope.roles[i]._id === id){
					return $scope.roles[i].name;
				}
			};
			return 'Error';
		}

		function init() {
			$http.get('/api/v1/roles/groups/' + $scope.selectedGroup._id)
			    .then(function(response) {
			        $scope.roles = response.data;
			    });
			//loadMembers();
		}

		/** 
		 * @name displayView
		 * @desc Open loadingMembers modal and load members.
		 */
		function displayView(type) {
			return !$scope.loading && ($scope.view === type);
		}

		/** 
		 * @name loadMembers
		 * @desc Open loadingMembers modal and load members.
		 */
		function loadMembers() {
			$modal.open({
			  templateUrl: 'app/members/modals/loadMembers/loadMembers.html',
		      controller: 'LoadmembersCtrl'
			}).result.then(function(members){
			  $scope.members = members;
			  $scope.loading = false;
			});	
		}

		/** 
		 * @name order
		 * @desc Change descending and ascending order of predicate.
		 */
		function order(predicate) {
			$scope.reverse = ($scope.predicate === predicate) ? !$scope.reverse : false;
			$scope.predicate = predicate;
		}

		/** 
		 * @name selectAllMembers
		 * @desc Add or Remove all members from $scope.selectedMembers.
		 * @params {{Boolean}} selectAll, are we adding or removing members.
		 */
		function selectAllMembers(selectAll) {
			if(selectAll) {
				$scope.selectedMembers = angular.copy($scope.members);
			} else {
				$scope.selectedMembers = [];
			}
		}

		/** 
		 * @name selectMember
		 * @desc Check if member is in $scope.selectedMembers.
		 * @params {{Object}} member, a member object.
		 */
		function selectMember(member) {
			if(selected(member)) {
				$scope.selectedMembers = _.reject($scope.selectedMembers, function(item) {
					return item._id === member._id;
				});
			} else {
				$scope.selectedMembers.push(member);
			}
		}

		/** 
		 * @name selected
		 * @desc Check if member is selected, in $scope.selectedMembers.
		 * @params {{Object}} member, a member object.
		 * @return {{Boolean}} returns undefined if member is not found.
		 */
		function selected(member) {
			return _.findWhere($scope.selectedMembers, {
				_id: member._id
			});
		}

 		/** 
		 * @name editMember
		 * @desc Display a sweetalert to confirm members deletion.
		 * On cancel deletion, display a message that the members
		 * are safe and have not been deleted.
		 * On delete, display a message that the members have been deleted.
		 */
		function editMember(id) {
			$state.go('member.create', {
				id: id
			});
		}

		/** 
		 * @name Delete All Members
		 * @desc Display a sweetalert to confirm members deletion.
		 * On cancel deletion, display a message that the members
		 * are safe and have not been deleted.
		 * On delete, display a message that the members have been deleted.
		 */
		function deleteAllSelectedMembers() {
			var numberOfSelectedMembers = $scope.selectedMembers.length;

			if(numberOfSelectedMembers > 0) {
				SweetAlert.swal({
				   title: 'Are you sure?',
				   text: 'You will not be able to recover these ' + numberOfSelectedMembers + ' members!',
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete them!",
				   cancelButtonText: "No, cancel please!",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
				   		Groups
			   				.deleteMembers($scope.selectedGroup._id, getIdArray($scope.selectedMembers))
			   				.then(success, error);
				   } else {
				      SweetAlert.swal("Cancelled", "Your members are safe :)", "error");
				   }
				});
			}

			function getIdArray(members) {
				var idArray = [];
				angular.forEach(members, function(member) { 
					idArray.push(member._id);
		   		});

				return idArray;
			}

			function success(response) {
				// remove members from members array.
		   		angular.forEach($scope.selectedMembers, function(member) { 
		   			$scope.members = _.reject($scope.members, function(item) {
						return item._id === member._id;
					});
		   		});
		   		// empty selected members array.
		   		$scope.selectedMembers = [];
				SweetAlert.swal("Deleted!", "Your members have been deleted.", "success");
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name Update Member
		 * @desc Display a sweetalert to confirm member updation.
		 * On cancel updation.
		 * On update, display a message that the member has been updated.
		 * @params {{Object}} member, a member object.
		 */
		function updateMember(member) {
			SweetAlert.swal({
			   title: "Are you sure?",
			   text: "You will update this member!",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, update it!",
			   cancelButtonText: "No, cancel please!",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){ 
			   if (isConfirm) {
			   		member.fullName = member.fullName.replace(/^\s+|\s+$/g, "");
			   		var index = member.fullName.indexOf(' ');
			   		if(index !== -1){
						member.last_name = member.fullName.slice(index+1);
						member.first_name = member.fullName.slice(0, index);
			   		} else {
			   			member.first_name = member.fullName;
			   		}
			   		delete member.fullName;
					delete member.memberBeforeEditing;
			   		Groups
		   				.updateMember(member)
		   				.then(success, error);
			   } else {
			      SweetAlert.swal("Cancelled", "Your member is safe :)", "error");
			   }
			});

			function success(response) {
				member.edit = false;
				SweetAlert.swal("Updated!", "Your member has been updated.", "success");	
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}
		/** 
		 * @name Cancel Member Update
		 * @params {{Object}} member, a member object.
		 */
		function cancelMemberUpdate(member) {
			for(var key in member){
				if(key !== '_id' && member.memberBeforeEditing) {
					member[key] = member.memberBeforeEditing[key];
				}
			}
			delete member.fullName;
			delete member.memberBeforeEditing;
			member.edit = false;
		}

		/** 
		 * @name Edit Member
		 * @params {{Object}} member, a member object.
		 */
		function editMember(member) {
			member.memberBeforeEditing = _.cloneDeep(member);
			member.fullName = (member.first_name || '')  + ' ' + (member.last_name || '');
			member.edit = true;
		}

		/** 
		 * @name Delete Member
		 * @desc Display a sweetalert to confirm member deletion.
		 * On cancel deletion, display a message that the member
		 * is safe and has not been deleted.
		 * On delete, display a message that the member has been deleted.
		 * @params {{Object}} member, a member object.
		 */
		function deleteMember(member) {
			SweetAlert.swal({
			   title: "Are you sure?",
			   text: "You will not be able to recover this member!",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
			   cancelButtonText: "No, cancel please!",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){ 
			   if (isConfirm) {
			   		var memberId = [member._id];
			   		Groups
		   				.deleteMembers($scope.selectedGroup._id, memberId)
		   				.then(success, error);
			   } else {
			      SweetAlert.swal("Cancelled", "Your member is safe :)", "error");
			   }
			});

			function success(response) {
				// remove member from members array.
				$scope.members = _.reject($scope.members, function(item) {
					return item._id === member._id;
				});
				$scope.selectedMembers = _.reject($scope.selectedMembers, function(item) {
					return item._id === member._id;
				});

				SweetAlert.swal("Deleted!", "Your member has been deleted.", "success");	
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name Share Member
		 * @desc Display a modal for user to copy the share url
		 * or iframe for the member selected.
		 * @params {{Number}} memberId, the member id. 
		 */
		function shareMember(memberId) {
			$modal.open({
			  templateUrl: 'app/members/modals/shareMembers/shareMembers.html',
		      controller: 'SharemembersCtrl',
			  resolve: {
		        memberId: function () {
		          return memberId;
		        }
		      }
			})
		}

		/** 
		 * @desc Watch for group change and load group members.
		 */
		// $scope.$watch(function() {
  //               return State.dim.group._id
  //           }, function(newGroup, oldGroup) {
  //           if(newGroup !== oldGroup) {
  //               loadMembers();
  //           }
  //       });
	}
})();
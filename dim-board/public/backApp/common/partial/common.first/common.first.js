angular.module('common').controller('CommonFirstCtrl',function($scope, $location, Groups, SweetAlert){
    $scope.createGroup = createGroup;
    function createGroup() {
        $('#add-first-group-btn').attr('disabled', 'disabled');
        Groups
            .createGroup($scope.groupName)
            .then(success, error);

        function success(response) {
            if (response.data._id) {
                $scope.selectGroup(response.data);
                SweetAlert.swal("Welcome!", "The first group has been created.", "success");
                $location.path('/dashboards');
            } else if (response.data.errorCode == 201) {
                SweetAlert.swal('Error', 'Server error ' + response.data.errorCode + ': ' + response.data.errorMessage, 'error');
            }
        }

        function error(response) {
            SweetAlert.swal('Error', 'Server error ' + response.data.errorCode + ': ' + response.data.errorMessage, 'error');
        }
    }
});
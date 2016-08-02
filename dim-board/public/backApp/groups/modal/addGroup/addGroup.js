angular.module('groups').controller('AddgroupCtrl',function($scope, $modalInstance, Groups, SweetAlert){
    setTimeout(function(){
        $('input[name="group"]').focus();
    },100)
    $scope.save = save;
    $scope.close = close;
    $scope.savedGroup = {};
    $scope.saveError = false;

    function save() {
        $('#add-group-btn').attr('disabled', 'disabled');
        Groups.createGroup($scope.newGroup)
            .then(success, error);

        function success(response) {
            if(response.data.name) {
                SweetAlert.swal("Created!", "New group has been created!", "success");
                $scope.savedGroup = response.data;
                $modalInstance.close($scope.savedGroup);
            } else if(response.data.errorCode == 201) {
                $scope.saveError = true;
                $scope.message = response.data.errorMessage;
            }
        }

        function error(response) {

        }
    };

    function close() {
        $modalInstance.close($scope.savedGroup);
    };
});
angular.module('cards').controller('ViewcardCtrl',function($scope, store){
    $scope.viewCardId = store.get('viewCardId');
});
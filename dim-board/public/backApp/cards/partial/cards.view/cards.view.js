angular.module('cards').controller('CardsViewCtrl',function($scope, $modal, store){
    $scope.viewCard = viewCard;

    /**
     * @name viewCard
     * @desc Open view card modal.
     */
    function viewCard(cardId) {
        store.set('viewCardId', cardId);
        $modal.open({
            templateUrl: '../backApp/cards/modal/viewCard/viewCard.html',
            controller: 'ViewcardCtrl'
        }).result.then(function(result){

        });
    }
});
(function(){
'use strict';

angular
	.module('cards')
	.controller('CardsListCtrl', CardsListCtrl);

	CardsListCtrl.$inject = ['$scope', '$state', 'SweetAlert', '$modal', 'Cards'];

	/**
	 * @name CardsListCtrl
	 * @desc List cards in list and grid views.
	 * @memberOf cards
	 */
	function CardsListCtrl($scope, $state, SweetAlert, $modal, Cards) {
		$scope.loading = true;
		$scope.view = 'list';
		$scope.displayView = displayView;
		$scope.predicate = 'title';
		$scope.reverse = true;
		$scope.order = order;
		$scope.selectedCards = [];
		$scope.selectedCard = {};
		$scope.selected = selected;
		$scope.selectCard = selectCard;
		$scope.selectAllCards = selectAllCards;
		$scope.deleteAllCards = deleteAllCards;
		$scope.deleteCard = deleteCard;
		$scope.shareCard = shareCard;
		$scope.editCard = editCard;
		$scope.viewDetails = viewDetails;

		init();

		function init() {
			//loadCards();
		}

		/*
		 * TODO: REMOVE, Temporaily here to create cards.
		 */
		$scope.createCard = createCard;
		function createCard() {

			var newCard = {
				group_id: $scope.selectedGroup._id,
				title: 'New Card Added from API ' + $scope.cards.length,
				type: 'Pie',
				data: {},
				file: {
					bucket: "www.dashboardinaminute.com",
					data: [],
					name: "monthly-average-rainfall.csv",
					path: "files/csv/140215567ba26dd7e66.20074778-10-bar-with-negative-value-csv.csv"
				}
			};

			Cards.saveCards(newCard).then(function(card) {
				$scope.cards.push(card);
			});
		}

		/** 
		 * @name editCard
		 * @desc Display a sweetalert to confirm dashboards deletion.
		 * On cancel deletion, display a message that the dashboards
		 * are safe and have not been deleted.
		 * On delete, display a message that the dashboards have been deleted.
		 */
		function editCard(id) {
			$state.go('cards.create', {
				id: id
			});
		}

		/** 
		 * @name displayView
		 * @desc Open loadingCards modal and load cards.
		 */
		function displayView(type) {
			return !$scope.loading && ($scope.view === type);
		}

		/** 
		 * @name loadCards
		 * @desc Open loadingCards modal and load cards.
		 */
		function loadCards() {
			$modal.open({
			  templateUrl: 'app/cards/modals/loadCards/loadCards.html',
			  controller: 'LoadcardsCtrl'
			}).result.then(function(cards){
			  $scope.cards = cards;
                    console.log(cards);
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
		 * @name selectAllCards
		 * @desc Add or Remove all cards from $scope.selectedCards.
		 * @params {{Boolean}} selectAll, are we adding or removing cards.
		 */
		function selectAllCards(selectAll) {
			if(selectAll) {
				$scope.selectedCards = angular.copy($scope.cards);
			} else {
				$scope.selectedCards = [];
			}
		}

		/** 
		 * @name selectCard
		 * @desc Check if card is in $scope.selectedCards.
		 * @params {{Object}} card, a card object.
		 */
		function selectCard(card) {
			if(selected(card)) {
				$scope.selectedCards = _.reject($scope.selectedCards, function(item) {
					return item._id === card._id;
				});
			} else {
				$scope.selectedCards.push(card);
			}
		}

		/** 
		 * @name selected
		 * @desc Check if card is selected, in $scope.selectedCards.
		 * @params {{Object}} card, a card object.
		 * @return {{Boolean}} returns undefined if card is not found.
		 */
		function selected(card) {
			return _.findWhere($scope.selectedCards, {
				id: card._id
			});
		}

		/** 
		 * @name Delete All Cards
		 * @desc Display a sweetalert to confirm cards deletion.
		 * On cancel deletion, display a message that the cards
		 * are safe and have not been deleted.
		 * On delete, display a message that the cards have been deleted.
		 */
		function deleteAllCards() {
			var numberOfSelectedCards = $scope.selectedCards.length;

			if(numberOfSelectedCards > 0) {
				SweetAlert.swal({
				   title: 'Are you sure?',
				   text: 'You will not be able to recover these ' + numberOfSelectedCards + ' cards!',
				   type: "warning",
				   showCancelButton: true,
				   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete them!",
				   cancelButtonText: "No, cancel please!",
				   closeOnConfirm: false,
				   closeOnCancel: false }, 
				function(isConfirm){ 
				   if (isConfirm) {
				   		Cards
			   				.deleteCards(getIdArray($scope.selectedCards))
			   				.then(success, error);
				   } else {
				      SweetAlert.swal("Cancelled", "Your cards are safe :)", "error");
				   }
				});
			}

			function getIdArray(cards) {
				var idArray = [];
				angular.forEach(cards, function(card) { 
					idArray.push(parseInt(card._id, 10));
		   		});

				return idArray;
			}

			function success(response) {
				// remove cards from cards array.
		   		angular.forEach($scope.selectedCards, function(card) { 
		   			$scope.cards = _.reject($scope.cards, function(item) {
						return item._id === card._id;
					});
		   		});
		   		// empty selected cards array.
		   		$scope.selectedCards = [];
				SweetAlert.swal("Deleted!", "Your cards have been deleted.", "success");
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name Delete Card
		 * @desc Display a sweetalert to confirm card deletion.
		 * On cancel deletion, display a message that the card
		 * is safe and has not been deleted.
		 * On delete, display a message that the card has been deleted.
		 * @params {{Object}} card, a card object.
		 */
		function deleteCard(card) {
			SweetAlert.swal({
			   title: "Are you sure?",
			   text: "You will not be able to recover this card!",
			   type: "warning",
			   showCancelButton: true,
			   confirmButtonColor: "#DD6B55",confirmButtonText: "Yes, delete it!",
			   cancelButtonText: "No, cancel please!",
			   closeOnConfirm: false,
			   closeOnCancel: false }, 
			function(isConfirm){ 
			   if (isConfirm) {
			   		Cards
		   				.deleteCards(card._id)
		   				.then(success, error);
			   } else {
			      SweetAlert.swal("Cancelled", "Your card is safe :)", "error");
			   }
			});

			function success(response) {
				// remove card from cards array.
		   		$scope.cards = _.reject($scope.cards, function(item) {
					return item._id === card._id;
				});
				$scope.selectedCards = _.reject($scope.selectedCards, function(item) {
					return item._id === card._id;
				});
				SweetAlert.swal("Deleted!", "Your card has been deleted.", "success");	
			}

			function error(response) {
				SweetAlert.swal('Error', 'Server error ' +  response.data.code + ': ' + response.data.message, 'error');
			}
		}

		/** 
		 * @name Share Card
		 * @desc Display a slide menu for user to copy the share url
		 * or iframe for the card selected.
		 * @params {{Object}} card, the card object.
		 */
		function shareCard(card) {
			$scope.selectedCard = card;
		}

		/**
		 * @name viewDetails
		 * @desc Save selected card for view details.
		 * @params {{Object}} card, a card object.
		 */
		function viewDetails(card) {
			console.log('card detail:', card);
			$scope.viewCard = card;
		}

		/** 
		 * @desc Watch for group change and load group cards.
		 */
		$scope.$watch(function() {
                return $scope.selectedGroup;
            }, function(newGroup, oldGroup) {
            if(newGroup !== oldGroup) {
                //loadCards();
            }
        });


        // TO: REMOVE, used becuase we don't have cards with data.
        $scope.cardConfig = {
                    options: {
                        xAxis: {
                            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
                        },
                        yAxis: {
                            title: {
                                text: 'Temperature (°C)'
                            },
                            plotLines: [{
                                value: 0,
                                width: 1,
                                color: '#808080'
                            }]
                        },
                        exporting: false,
                        tooltip: {
                            valueSuffix: '°C'
                        }
                    },
                    series: [{
                        name: 'Tokyo',
                        data: [7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
                    }, {
                        name: 'New York',
                        data: [-0.2, 0.8, 5.7, 11.3, 17.0, 22.0, 24.8, 24.1, 20.1, 14.1, 8.6, 2.5]
                    }, {
                        name: 'Berlin',
                        data: [-0.9, 0.6, 3.5, 8.4, 13.5, 17.0, 18.6, 17.9, 14.3, 9.0, 3.9, 1.0]
                    }, {
                        name: 'London',
                        data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
                    }]
                }
	}
})();
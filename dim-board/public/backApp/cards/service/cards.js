(function(){
'use strict';

angular
	.module('cards')
	.factory('Cards', Cards);

	Cards.$inject = ['$http'];

	/**
	 * @name Cards
	 * @desc API for cards
	 * @memberOf cards
	 */
	function Cards($http) {
		var Cards = {};

		/** 
		 * @name getCards
		 * @desc Get cards by group id.
		 * @return {{JSON}} cards, cards created by all authors.
		 */
		Cards.getCards = function(groupId) {
			//return HearstAPI.getCards();

			return $http.get('/api/v1/cards/group/' + groupId).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name getCard
		 * @desc Get a card.
		 * @return {{JSON}} card, card object.
		 */
		Cards.getCard = function(id) {
			//return HearstAPI.getCard(contentId);

			return $http.get('/api/v1/cards/' + id).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name saveCard
		 * @desc Save a card
		 * @return {{JSON}} card, saved card object.
		 */
		Cards.saveCard = function(obj) {
			return $http.post('/api/v1/cards', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name updateCard
		 * @desc Update a card
		 * @return {{JSON}} card, updated card object.
		 */
		Cards.updateCard = function(obj) {
			return $http.put('/api/v1/cards', obj).then(function(response) {
				return response.data;
			});
		};

		/** 
		 * @name deleteCards
		 * @desc Delete a card
		 * @params {{Array.Integers}} idArray, an array of card ids to be deleted.
		 */
		Cards.deleteCards = function(idArray) {
			//return HearstAPI.deleteCards(idArray);
			return $http.delete('/api/v1/cards/' + idArray).then(function(response) {
				return response.data;
			});
		};

		return Cards;
	}
})();
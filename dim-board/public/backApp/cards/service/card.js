(function(){
'use strict';

angular
	.module('cards')
	.service('Card', Card);

	Card.$inject = ['Groups'];

	/**
	 * @name Card
	 * @desc Options available to cards
	 * @memberOf cards
	 */
	function Card(Groups) {
		var Card = {
	        title: 'New Card',
	        thumb_url: "/backApp/assets/img/dashboard/dashboard2.jpg",
	        alerts: [],
	        comments: [],
	        widget: 4,
	        sizeX: 6,
	        sizeY: 5,
	        settings: {
                classes: ['widget-loader-bar']
            },
	        cardOptions: [],
	        elem: '<div class="card-container container-sm-height full-height"> <div class="row-sm-height"> <div class="col-sm-height col-top"> <div class="panel-heading "> <div class="panel-title text-black hint-text"> <span class="font-montserrat fs-11 all-caps">Page Views <i class="fa fa-chevron-right"></i> </span> </div> <div class="panel-controls"> <ul> <li class="hidden-xlg"> <div class="dropdown"> <a data-target="#" href="" data-toggle="dropdown" aria-haspopup="true" role="button" aria-expanded="false"> <i class="portlet-icon portlet-icon-settings"></i> </a> <ul class="dropdown-menu pull-right" role="menu"> <li><a href="">Share</a> </li> <li ng-click="copyCard(card)"><a href="">Duplicate</a> </li> <li><a href="">Export</a> </li> <li ng-click="deleteCard(card)"><a href="">Delete</a> </li> </ul> </div> </li> <li><a ng-click="refresh()" class="portlet-refresh text-black" data-toggle="refresh"><i class="portlet-icon portlet-icon-refresh"></i></a> </li> </ul> </div> </div> </div> </div> <div class="row-sm-height"> <div class="col-sm-height col-top"> <div class="p-l-20 p-r-20"> <h5 class="no-margin p-b-5 pull-left hint-text">Pages</h5> <p class="pull-right no-margin bold hint-text">2,563</p> <div class="clearfix"></div> </div> </div> </div> <div class="row-sm-height"> <div class="col-sm-height col-bottom "></div> </div> </div>',
	        datasources: [],
	        description: '',
	        share_url : '',
	        groups: [
                {
                  _id: Groups.selectedGroup()._id,
                  permission_id: 0
                }
            ]
	    };

		return Card;
	}

})();
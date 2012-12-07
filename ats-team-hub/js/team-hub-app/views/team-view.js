/*global Backbone, TeamHub */

TeamHub.Views.Team = Backbone.Marionette.ItemView.extend({
	template : "#team-hub-team-template",
	tagName : 'li',
	events : {
		"click button.cross" : "crossClick"
	},

	crossClick : function (event) {
		'use strict';
		if(this.options.vent) {
			this.options.vent.trigger('team:remove');
		}
		this.model.destroy();
	}
});

TeamHub.Views.Teams = Backbone.Marionette.CollectionView.extend({
	itemView : TeamHub.Views.Team,
	tagName : 'ul'
});
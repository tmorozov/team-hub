/*global Backbone, TeamHub, jQuery, window */

TeamHub.Models.Team = Backbone.Model.extend({
	sync: function (method) {
		'use strict';
		var that = this;
		if ('create' === method) {
			return jQuery.post(window.ajaxurl, {
				'action' : 'create-team',
				'name' : this.get('name')
			}, function (responce) {
				that.set(responce);
			}, 'json');
		}
	}
});

TeamHub.Models.TeamCollection = Backbone.Collection.extend({
	model : TeamHub.Models.Team,
	sync : function (method) {
		'use strict';
		var that = this;
		if ('read' === method) {
			return jQuery.post(window.ajaxurl, {
				'action' : 'get-teams'
			}, function (responce) {
				that.reset(responce);
			}, 'json');
		}
	}
});

/*global Backbone, TeamHub, jQuery, window */

TeamHub.Models.Team = Backbone.Model.extend({
	sync: function (method, model, options) {
		'use strict';
		var that = this;
		if ('create' === method) {
			return jQuery.post(TeamHub.ajaxurl, {
				'action' : 'create-teamhub-team',
				'name' : this.get('name')
			}, options.success, 'json');
		}
		if ('delete' === method) {
			return jQuery.post(TeamHub.ajaxurl, {
				'action' : 'del-teamhub-team',
				'name' : this.get('name'),
				'id' : this.get('id')
			}, options.success, 'json');
		}
	}
});

TeamHub.Models.TeamCollection = Backbone.Collection.extend({
	model : TeamHub.Models.Team,
	sync : function (method, model, options) {
		'use strict';
		var that = this;
		if ('read' === method) {
			return jQuery.post(TeamHub.ajaxurl, {
				'action' : 'get-teamhub-teams'
			}, options.success, 'json');
		}
	}
});

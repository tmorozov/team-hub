/*global jQuery, Backbone, TeamHub */

TeamHub.Models.Article = Backbone.Model.extend({});

TeamHub.Models.ArticleCollection = Backbone.Collection.extend({
	model : TeamHub.Models.Article,
	sync : function (method, model, options) {
		'use strict';
		var that = this;
		if ('read' === method) {
			return jQuery.post(TeamHub.ajaxurl, {
				'action' : 'get-teamhub-articles'
			}, options.success, 'json');
		}
	}

});

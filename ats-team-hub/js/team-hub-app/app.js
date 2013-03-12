/*global jQuery, Backbone, TeamHub */

TeamHub.startApplication = function (options) {
	'use strict';
	TeamHub.App = new Backbone.Marionette.Application();
	TeamHub.App.addRegions({
		mainRegion: ".ats-team-hub-content"
	});

	TeamHub.App.addInitializer(function (options) {
		options.articles = options.articles || [];
		this.articles = new TeamHub.Models.ArticleCollection(options.articles);
		this.teams = new TeamHub.Models.TeamCollection();

		var articlesView = new TeamHub.Views.Articles({
			collection : this.articles
		});
		this.mainRegion.show(articlesView);
	});

	TeamHub.App.addInitializer(function (options) {
		var that = this;
		jQuery('a.select-teams').on('click', function (event) {
			event.preventDefault();
			event.stopPropagation();

			var teamsView = new TeamHub.Views.Teams({
				collection : that.teams,
				vent : that.vent
			});

			// TODO: test this part!
			teamsView.on("show", function () {
				teamsView.$("#team-input").suggest(TeamHub.ajaxurl + '?action=find-teamhub-team', {
					onSelect: function () {
						that.teams.create({
							'name' : this.value,
							'logo' : ''
						}, {wait: true});
						//console.log("team selected: " + this.value);
					}
				});
			});

			that.teams.fetch();
			that.mainRegion.show(teamsView);

		});
	});

	TeamHub.App.vent.on('articles:show', function () {
		var articlesView = new TeamHub.Views.Articles({
			collection : TeamHub.App.articles
		});
		TeamHub.App.articles.fetch();
		TeamHub.App.mainRegion.show(articlesView);
	});

	TeamHub.App.start(options);
};

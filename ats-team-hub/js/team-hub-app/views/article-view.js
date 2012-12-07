/*global Backbone, TeamHub */

TeamHub.Views.Article = Backbone.Marionette.ItemView.extend({
	tagName : 'li',
	template : '#team-hub-article-template'
});

TeamHub.Views.Articles = Backbone.Marionette.CollectionView.extend({
	itemView : TeamHub.Views.Article,
	tagName : 'ul'
});
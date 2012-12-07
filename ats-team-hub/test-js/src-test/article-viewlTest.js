TestCase("Article View", {
	setUp : function() {
/*:DOC +=
<div class="templates">

<script id="team-hub-article-template" type="template">
<a href="<%= url %>">
	<img class="thumb" src="<%= thumb %>" />
	<img class="logo" src="<%= team.logo %>" />
	<div class="name"><%= team.name %></div>
	<div class="title"><%= title %></div>
</a>
</script>

</div>
*/
		this.article = new TeamHub.Models.Article({
			'thumb' : 'art-img.jpg',
			'title' : 'You had to know!',
			'url' : '?page=1',
			'team' : {
				'logo' : 'team-img.jpg',
				'name' : 'Buffalo'
			}
		});

		this.articleView = new TeamHub.Views.Article({
			model : this.article
		});
		
		this.articleView.render();
	},

	"test Article Views is defined": function() {
		assertFunction("Article Views is function", TeamHub.Views.Article);
	},

	"test Article View renders li": function() {
		assertEquals("is li", "li", this.articleView.tagName);
	},
	
	"test Article View shows thumbnail": function() {
		assertEquals("Has thumbnail image", 1, this.articleView.$("img.thumb").length);
	},
	
	"test Article View thumbnail url is from model": function() {
		assertEquals("thumbnail img url", this.article.get('thumb'), this.articleView.$('img.thumb').attr('src') );
	},
	
	"test Article View shows team logo": function() {
		assertEquals("Has logo image", 1, this.articleView.$("img.logo").length);
	},
	
	"test Article View team logo url is from model": function() {
		var team = this.article.get('team');
		assertEquals("logo img url", team.logo, this.articleView.$('img.logo').attr('src') );
	},

	"test Article View shows name": function() {
		var team = this.article.get('team');
		assertTrue("name set", team.name.length > 0);	
		assertEquals("name from model", team.name, this.articleView.$('div.name').html() );
	},
	
	"test Article View shows headline": function() {
		var title = this.article.get('title');
		assertTrue("name set", title.length > 0);	
		assertEquals("name from model", title, this.articleView.$('div.title').html() );
	},

	"test Article View have <a>": function() {
		assertEquals("Has <a> ", 1, this.articleView.$("a").length);
	},

	"test Article View <a> url is from model": function() {
		var url = this.article.get('url');
		assertTrue("url set", url.length > 0);	

		assertEquals("logo img url", url, this.articleView.$('a').attr('href') );
	},

	"test Article View when you click on eny part of article view <a> is clicked": function() {
		var count = 0;
		function onAclick(event) {
			count++;
			event.preventDefault();
			event.stopPropagation();
		}
		
		this.articleView.$('a').on( "click", onAclick);

		this.articleView.$('img.logo').click();
		assertEquals("logo click -> a", 1, count );

		this.articleView.$('img.thumb').click();
		assertEquals("thumb click -> a", 2, count );

		this.articleView.$('div.name').click();
		assertEquals("name click -> a", 3, count );

		this.articleView.$('div.title').click();
		assertEquals("title click -> a", 4, count );

		this.articleView.$('a').off( "click", onAclick);
	},

});


TestCase("Articles View", {
	setUp : function() {
		this.articles = new TeamHub.Models.ArticleCollection([ {
				'thumb' : 'art-img1.jpg',
				'title' : 'You had to know!',
				'url' : '?page=1',
				'team' : {
					'logo' : 'team-img1.jpg',
					'name' : 'Buffalo'
				}
			},{
				'thumb' : 'art-img2.jpg',
				'title' : 'You had to know that to!',
				'url' : '?page=2',
				'team' : {
					'logo' : 'team-img2.jpg',
					'name' : 'Falcons'
				}
			}
		]);
		
		this.articlesView = new TeamHub.Views.Articles({
			collection : this.articles
		});
		
		this.articlesView.render();
	},
	
	"test Articles View is defined": function() {
		assertFunction("Articles View defined", TeamHub.Views.Articles);
	},
	"test Articles View holds Article View": function() {
		assertEquals("itemView is Articles", TeamHub.Views.Article, TeamHub.Views.Articles.prototype.itemView);
	},
	"test Articles View is ul": function() {
		assertEquals("articlesView renders ul", "ul", this.articlesView.tagName);
	},
	"test Articles View renders list": function() {
		assertEquals("articlesView renders list", 2, this.articlesView.$('li').length);
	},
	"test Articles View updates on new model": function() {
		this.articles.add({
			'thumb' : 'art-img3.jpg',
			'title' : 'Ниче себе!',
			'url' : '?page=3',
			'team' : {
				'logo' : 'desant.jpg',
				'name' : 'Сфинкс'
			}
		});
		assertEquals("articlesView renders list", 3, this.articlesView.$('li').length);
	}	
});


TestCase("Article Model", {
	"test Article Model is defined": function() {
		assertFunction("Article Model defined", TeamHub.Models.Article);
	}
});

TestCase("Article Collection Model", {	
	"test ArticleCollection Model is defined": function() {
		assertFunction("ArticleCollection", TeamHub.Models.ArticleCollection);
	},
	
	"test ArticleCollection holds Article": function() {
		assertEquals("model is Article", TeamHub.Models.Article, TeamHub.Models.ArticleCollection.prototype.model);
	}

});

TestCase("Article Collection Model serialization", {	
	setUp: function() {
		this.old_ajaxurl = TeamHub.ajaxurl;
		TeamHub.ajaxurl = "test.php";
		sinon.stub(jQuery, "ajax");		
	},
		
	tearDown: function () {
		TeamHub.ajaxurl = this.old_ajaxurl;
		jQuery.ajax.restore();
    },
	
	"test ArticleCollection fetch() POSTs to ajaxurl": function() {
		var articles = new TeamHub.Models.ArticleCollection();
		articles.fetch();
		
		assertTrue("AJAX params match", jQuery.ajax.calledWithMatch({ 
			url: TeamHub.ajaxurl,
			type: "post",
			data: {'action' : 'get-teamhub-articles'}
		}));	
	},
	
	"test ArticleCollection fetch() resets collection on success": function() {
		var articles = new TeamHub.Models.ArticleCollection();
		var content = [{"name" : "aa"}, {"name" : "bb"}, {"name" : "cc"}];
		articles.fetch();
		jQuery.ajax.args[0][0].success(content);
		assertEquals("length corect", 3, articles.length);
	}
});

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

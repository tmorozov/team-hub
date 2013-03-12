TestCase("TeamHub App", {
	setUp: function() {
/*:DOC +=
<div>
	<div class="templates">
	
		<script id="team-hub-article-template" type="template">
		<a href="<%= url %>">
			<img class="thumb" src="<%= thumb %>" />
			<img class="logo" src="<%= team.logo %>" />
			<div class="name"><%= team.name %></div>
			<div class="title"><%= title %></div>
		</a>
		</script>
		
		<script id="team-hub-teams-select-template" type="template">
			<input type="text" />
			<button class="done"></button>
			<ul></ul>
		</script>		

		<script id="team-hub-team-template" type="template">
			<img class="logo" src="<%= logo %>" />
			<div class="name"><%= name %></div>
			<button class="cross"></button>
		</script>
	</div>
	
	<div class="ats-team-hub-content">
	</div>
	
	<a href="" class="select-teams">customize/select your teams</a>
</div>

*/
		
		this.old_ajaxurl = TeamHub.ajaxurl;
		TeamHub.ajaxurl = "test.php";
		sinon.stub(jQuery, "ajax");		

		this.articles = [ {
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
		];
		

		this.options = {
			articles: this.articles
		};

		TeamHub.startApplication(this.options);
	},
	
	tearDown: function () {
		TeamHub.ajaxurl = this.old_ajaxurl;
		jQuery.ajax.restore();
    },	
	
	"test TeamHub App defined": function() {
		assertObject("TeamHub App is object", TeamHub.App);
	},
	
	"test App region is attached": function() {
		assertObject("main region added", TeamHub.App['mainRegion']);
	},
	
	"test on start() Articles are rendered": function() {
		assertEquals("articles rendered", 2, jQuery("a > img.thumb").length);
	},
	
	"test on 'select-teams' click region switched to team selection": function() {
		jQuery("a.select-teams").click();
		assertEquals("done button", 1, jQuery('button.done').length );
	},

	"test on 'select-teams' click teams loaded": function() {
		var content = [{
			"name" : "aa",
			'logo' : '1.jpg'
		}, {
			"name" : "bb",
			'logo' : '2.jpg'
		}, {
			"name" : "cc",
			'logo' : '3.jpg'
		}];
		jQuery("a.select-teams").click();
		jQuery.ajax.args[0][0].success(content);

		assertEquals("length corect", 3, TeamHub.App.teams.length);
		assertEquals("done button", 3, jQuery('button.cross').length );
	},
	
	"test on Done click articles loaded": function() {
		var teams = [];
		var articles = [ {
				'thumb' : '1.jpg',
				'title' : 'A',
				'url' : '?page=3',
				'team' : {
					'logo' : 'team-1.jpg',
					'name' : 'AA'
				}
			},{
				'thumb' : '2.jpg',
				'title' : 'B!',
				'url' : '?page=4',
				'team' : {
					'logo' : 'team-2.jpg',
					'name' : 'BB'
				}
			},{
				'thumb' : '3.jpg',
				'title' : 'C!',
				'url' : '?page=5',
				'team' : {
					'logo' : 'team-3.jpg',
					'name' : 'CC'
				}
			}
		];
		jQuery("a.select-teams").click();
		jQuery.ajax.args[0][0].success(teams);
		
		
		jQuery('button.done').click();
		jQuery.ajax.args[1][0].success(articles);
		
		assertEquals("articles rendered", 3, jQuery("a > img.thumb").length);
		
	}
});
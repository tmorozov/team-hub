TestCase("Team View", {
	setUp : function() {
/*:DOC +=
<div class="templates">

<script id="team-hub-team-template" type="template">
<img class="logo" src="<%= logo %>" />
<div class="name"><%= name %></div>
<button class="cross"></button>
</script>

<script id="team-hub-teams-select-template" type="template">

</script>

</div>
*/
	
		this.vent = {
			trigger: sinon.spy()
		};
		
		this.mediator = sinon.spy();
		this.team = new TeamHub.Models.Team({
			'logo' : 'img.jpg',
			'name' : 'Buffalo'
		});
		
		this.teamView = new TeamHub.Views.Team({
			model : this.team,
			vent : this.vent
		});
		
		this.teamView.render();
	},

	"test Team Views is defined": function() {
		assertFunction("Team Views is function", TeamHub.Views.Team);
	},

	"test Team View is li": function() {
		assertEquals("is li", "li", this.teamView.tagName);
	},
	
	"test Team View shows team logo": function() {
		assertEquals("Has logo image", 1, this.teamView.$("img.logo").length);
	},
	
	"test Team View logo url is from model": function() {
		assertEquals("logo img url", this.team.get('logo'), this.teamView.$('img.logo').attr('src') );
	},

	"test Team View shows name": function() {
		assertTrue("name set", this.team.get('name').length > 0);	
		assertEquals("name from model", this.team.get('name'), this.teamView.$('div.name').html() );
	},
	
	"test Team View shows cross button": function() {
		assertEquals("cross button", 1, this.teamView.$('button.cross').length );
	},
	
	"test Team View triggers 'team:remove' on cross clicked": function() {
		this.teamView.$('button.cross').click();
		assertTrue("cross triggers event", this.vent.trigger.calledWith('team:remove') );
	},

	"test Team View calls model.destroy on cross clicked": function() {
		sinon.spy(this.team, "destroy");
		this.teamView.$('button.cross').click();
		assertTrue("cross calls destroy", this.team.destroy.calledOnce );
		this.team.destroy.restore();
	}
	
});


TestCase("Teams View", {
	setUp : function() {
/*:DOC +=
<div class="templates">

<script id="team-hub-team-template" type="template">
<img class="logo" src="<%= logo %>" />
<div class="name"><%= name %></div>
<button class="cross"></button>
</script>

<script id="team-hub-teams-select-template" type="template">
<input type="text" />
<button class="done"></button>
<ul></ul>
</script>

</div>
*/
		this.vent = {
			trigger: sinon.spy()
		};
	
		this.teams = new TeamHub.Models.TeamCollection([ {
				'logo' : 'img1.jpg',
				'name' : 'Buldogs'
			}, {
				'logo' : 'img2.jpg',
				'name' : 'Falcons'
			}
		]);
		
		this.teamsView = new TeamHub.Views.Teams({
			collection : this.teams,
			vent : this.vent
		});
		
		this.teamsView.render();
	},
	
	"test Teams View is defined": function() {
		assertFunction("Teams View defined", TeamHub.Views.Teams);
	},
	"test Teams View holds Team View": function() {
		assertEquals("itemView is Team", TeamHub.Views.Team, TeamHub.Views.Teams.prototype.itemView);
	},
	// "test Teams View is ul": function() {
		// assertEquals("teamsView renders ul", "ul", this.teamsView.tagName);
	// },
	"test Teams View shoud have input": function() {
		assertEquals("input present", 1, this.teamsView.$('input[type=text]').length);
	},
	"test Teams View shoud have Done button": function() {
		assertEquals("done button", 1, this.teamsView.$('button.done').length );
	},
	"test Teams View renders list": function() {
		assertEquals("teamsView renders list", 2, this.teamsView.$('ul>li').length);
	},
	"test Teams View updates on new model": function() {
		this.teams.add({
			'logo' : 'img3.jpg',
			'name' : 'HZ'
		});
		assertEquals("teamsView renders list", 3, this.teamsView.$('li').length);
	},
	"test Teams View updates on del model": function() {
		this.teams.remove(this.teams.at(0));
		assertEquals("teamsView renders list", 1, this.teamsView.$('li').length);
	},
	"test Teams View updates on cross clicked in TeamView": function() {
		this.teamsView.$('button.cross').eq(0).click();
		assertEquals("teamsView renders list", 1, this.teamsView.$('li').length);
	},
	
	"test Teams View triggers 'articles:show' on Done clicked": function() {
		this.teamsView.$('button.done').click();
		assertTrue("Done triggers event", this.vent.trigger.calledWith('articles:show') );
	},

	
});

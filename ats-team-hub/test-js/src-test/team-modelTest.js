TestCase("Team Model", {
	setUp: function() {
		this.old_ajaxurl = TeamHub.ajaxurl;
		TeamHub.ajaxurl = "test.php";
		sinon.stub(jQuery, "ajax");		
	},
		
	tearDown: function () {
		TeamHub.ajaxurl = this.old_ajaxurl;
		jQuery.ajax.restore();
    },
	
	"test Team Model is defined": function() {
		assertFunction("Team Model is function", TeamHub.Models.Team);
	},
	
	"test Team Model calls AJAX on destroy()": function () {
		var team = new TeamHub.Models.Team({"name" : "aa"});
		// we'll set id to make Backbone think that model is persistent (saved on server)
		team.set("id", "18");
		team.destroy();
		assertTrue("AJAX called", jQuery.ajax.calledOnce);
		assertTrue("AJAX params match", jQuery.ajax.calledWithMatch({ 
			url: TeamHub.ajaxurl,
			type: "post",
			data: {
				'action' : 'del-teamhub-team',
				'id' : '18',
				'name' : 'aa'
			}
		}));		
	}
});

TestCase("Team Collection Model", {	
	"test TeamCollection Model is defined": function() {
		assertFunction("TeamCollection", TeamHub.Models.TeamCollection);
	},
	
	"test TeamCollection holds Team": function() {
		assertEquals("model is Team", TeamHub.Models.Team, TeamHub.Models.TeamCollection.prototype.model);
	}
});

TestCase("Team Collection Model serialization", {	
	setUp: function() {
		this.old_ajaxurl = TeamHub.ajaxurl;
		TeamHub.ajaxurl = "test.php";
		sinon.stub(jQuery, "ajax");		
	},
		
	tearDown: function () {
		TeamHub.ajaxurl = this.old_ajaxurl;
		jQuery.ajax.restore();
    },
	
	"test TeamCollection fetch() POSTs to ajaxurl": function() {
		var teams = new TeamHub.Models.TeamCollection();
		teams.fetch();
		
		assertTrue("AJAX params match", jQuery.ajax.calledWithMatch({ 
			url: TeamHub.ajaxurl,
			type: "post",
			data: {'action' : 'get-teamhub-teams'}
		}));	
	},
	
	"test TeamCollection fetch() resets collection on success": function() {
		var teams = new TeamHub.Models.TeamCollection();
		var content = [{"name" : "aa"}, {"name" : "bb"}, {"name" : "cc"}];
		teams.fetch();
		jQuery.ajax.args[0][0].success(content);
		assertEquals("length corect", 3, teams.length);
	},

	"test TeamCollection create() POSTs to ajaxurl": function() {
		var teams = new TeamHub.Models.TeamCollection();
		var name = 'Сфинкс';
		teams.create({ 'name' : name });
		
		assertTrue("AJAX params match", jQuery.ajax.calledWithMatch({ 
			url : TeamHub.ajaxurl,
			type : "post",
			data : {
				'action' : 'create-teamhub-team',
				'name' : name
			}
		}));	
	},
	
	"test TeamCollection create() updates collection on success": function() {
		var teams = new TeamHub.Models.TeamCollection();
		var name = 'Сфинкс';
		var logo = 'img.png';
		var content = {
			"name" : name, 
			"logo" : logo
		};
		
		teams.create({ 'name' : name });
		
		jQuery.ajax.args[0][0].success(content);
		assertEquals("data corect", logo, teams.at(0).get('logo'));
	}
});

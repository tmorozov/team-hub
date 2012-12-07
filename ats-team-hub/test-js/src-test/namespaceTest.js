
TestCase("TeamHub namespace", {
	"test TeamHub namespace defined": function() {
		assertObject("TeamHub is object", TeamHub);
	},

	"test TeamHub.Views defined": function() {
		assertObject("TeamHub.Views is object", TeamHub.Views);
	},

	"test TeamHub.Models defined": function() {
		assertObject("TeamHub.Models is object", TeamHub.Models);
	}
});


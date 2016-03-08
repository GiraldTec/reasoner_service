
var RuleEngine = require('node-rules');

var rules = [{
	"condition" : function(R) {
		R.when(this.p > 2);
	},
	"consequence" : function(R) {
		this.result = "true";
		R.stop();
	},
	"priority" : 4
},

{
	"condition" : function(R) {
	},
	"consequence" : function(R) {
		this.result = "false";
		R.stop();
	},
	"priority" : 4
}];



var fact = {
    "p":2,
};


function razonamientoP (){
	var R = new RuleEngine(rules);

	R.execute(fact,function(result){ 

	    if(result.result) 
	        console.log("\n-----P es 2----\n"); 
	    else 
	        console.log("\n-----P no es 2----\n");

	});
}

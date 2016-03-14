(
function(){
	'use strict';
	var rEngine = require('./node_modules/node-rules/index');

	function pruebaR(){
		this.rules = [{
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
		
		this.fact = {
			"p":2,
		};
		
		this.razonamientoP = function(){
			var R = new rEngine(rules);

			R.execute(fact,function(result){ 

				if(result.result) 
					console.log("\n-----P es 2----\n"); 
				else 
					console.log("\n-----P no es 2----\n");

			});
		}
	}

	module.exports = pruebaR;

}(module.exports));
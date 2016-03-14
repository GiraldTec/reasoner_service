(
function(){
	'use strict';

	//import the package
	var rEngine = require('./node_modules/node-rules/index');

	
	function exampleR(){
		//define the rules
		this.rules = [{
			"condition": function(R) {
				R.when(this && (this.transactionTotal < 500));
			},
			"consequence": function(R) {
				this.result = '{"value":"-----Payment Rejected----"}';
				R.next();
			}
		},{
			"condition": function(R) {
				R.when(this && (this.transactionTotal > 500));
			},
			"consequence": function(R) {
				this.result = '{"value":"-----Payment Accepted----"}';
				R.stop();
			}
		}];
		
		
		/*as you can see above we removed the priority 
		and on properties for this example as they are optional.*/ 

		//sample fact to run the rules on   
		this.fact = {
			"userIP": "27.3.4.5",
			"name":"user4",
			"application":"MOB2",
			"userLoggedIn":true,
			"transactionTotal":300,
			"cardType":"Credit Card",
		};
		
		this.setRules = function(rls){
			this.rules = {};
			console.log('entrando ++++++++++++++++++++++++++++++++++++++');
			console.log(rls);
			rEngine.fromJSON(rls);
			console.log(this.rules);

		}
		
		this.setFacts = function(fts){
			this.fact = fts;
		}
		
		this.razonamientoE = function(callback){
			console.log(this.fact);
			//initialize the rule engine
			var R = new rEngine(this.rules);


			//Now pass the fact on to the rule engine for results
			R.execute(this.fact,function(result){ 
				/*var res  = "";
				if(result.result) 
					res = '{"value":"-----Payment Accepted----"}';
					
				else 
					res = '{"value":"-----Payment Rejected----"}';*/
				
				var salida = JSON.parse(result.result);
		
				return callback(salida);
			});
			
		}
	}

	module.exports = exampleR;

}(module.exports));
	
	

	
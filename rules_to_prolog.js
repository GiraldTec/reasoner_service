(
function(){
	'use strict';

	function parser(){
		
		this.stream = "";
		
		this.update_facts = function(){
			// TODO
		}
		
		this.is_reference = function(op){
			return op.charAt(0)=='$';
		}
		
		this.operand_reference = function(op,n){
			return op.substring(1)+'(X'+n+'),';
		}
				
		this.parse = function(rules, facts){
			// Get the date in order to create the file
			var date = new Date();
			var now = date.toISOString();
			console.log(now);
			
			// Open the file to write
			var fs = require('fs');
			var stream = fs.createWriteStream( now+".pl");
			console.log('creado el stream');
			//stream.write("My first row\n");

			
			// Parse the inputs
			var rules_list = rules.split(";");
			var facts_list = facts.split(";");
			console.log(rules_list);
			console.log(facts_list);
			
			for(var i = 0; i< rules_list.length; i++){
				var json_rule = JSON.parse(rules_list[i])
				console.log(json_rule);
				var pl_rule = "result("+json_rule.result+"):-\n";
				var conditions_list = json_rule.conditions.split(" and ");
				var number_variables = 0;
				
				for (var j=0; j< conditions_list.length; j++){
					console.log('we have conditions');
					if (j>0){
						pl_rule = pl_rule+",\n"
					}
					var condition = conditions_list[j];
					var condition_elements = condition.split(" ");
					console.log('condition elements' + Object.keys(condition_elements).length);
					console.log(condition_elements);
					if (Object.keys(condition_elements).length == 3) {
						console.log('three elements');
						var operand1 = condition_elements[0];
						var operator = condition_elements[1];
						var operand2 = condition_elements[2];
						
						if (this.is_reference(operand1)){
							console.log('es referencia '+operand1);
							pl_rule = pl_rule + this.operand_reference(operand1,number_variables) +"\n";
							operand1 = 'X'+number_variables;
							number_variables ++;
						}
						if (this.is_reference(operand2)){
							console.log('es referencia '+operand2);
							pl_rule = pl_rule + this.operand_reference(operand2,number_variables) +"\n";
							operand2 = 'X'+number_variables;
							number_variables ++;
						}
						pl_rule = pl_rule + operand1+" "+operator+" "+operand2;
						console.log(pl_rule);
					}
				}
				
				pl_rule = pl_rule+".\n"
				console.log(pl_rule);
				
				// Write on file
				stream.write(pl_rule);
			}
			
			// TODO
			for(var i = 0; i< facts_list.length; i++){
				var json_fact = JSON.parse(facts_list[i])
				console.log(json_fact);
				
				var options = {};
				options.host = json_fact.host;
				options.port = json_fact.port;
				options.path = json_fact.path;
				
				http.request(options, function(response) {
					var str = '';

					response.on('data', function (chunk) {
						str += chunk;
					});

					response.on('end', function () {
						this.update_facts(str);
					});
				}).end();
				
				
				
				
			}			
			
			// Close the stream
			stream.end();
		}
	}

	module.exports = parser;

}(module.exports));
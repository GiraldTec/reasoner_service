//import the package
var RuleEngine = require('node-rules');

//define the rules
var rules = [{
    "condition": function(R) {
        R.when(this && (this.transactionTotal < 500));
    },
    "consequence": function(R) {
        this.result = false;
        R.stop();
    }
}];
/*as you can see above we removed the priority 
and on properties for this example as they are optional.*/ 

//sample fact to run the rules on   
var fact = {
    "userIP": "27.3.4.5",
    "name":"user4",
    "application":"MOB2",
    "userLoggedIn":true,
    "transactionTotal":400,
    "cardType":"Credit Card",
};

function razonamientoE (){

    //initialize the rule engine
    var R = new RuleEngine(rules);

    //Now pass the fact on to the rule engine for results
    R.execute(fact,function(result){ 

        if(result.result) 
            console.log("\n-----Payment Accepted----\n"); 
        else 
            console.log("\n-----Payment Rejected----\n");

    });
}
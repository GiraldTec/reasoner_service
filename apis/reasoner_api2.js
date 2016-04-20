/**
 * reasoner.js
 * 
 * DESCRIPTION:
 * a "HELLO WORLD" server-side application to demonstrate running a node 
 * API Appserver on a Raspberry Pi to access IOs
 * Uses the Express node packages. 
 * 
 * 
 */

var express   = require('express');

var prueba = require('../prueba_node_r');
var example = require('../example_node_r');

var parser = require('../rules_to_prolog');

var app       = express();


var reason = function(request){
	console.log("RAZONANDOOOOO");
};

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the parent directory
//app.use(express.static(__dirname));
app.use(express.static(__dirname+'/../'));

// reasoning request
app.get('/reasoner', function (req, res) {
  console.log('Reasoning request');
  response = function(answer){
  	res.send('Processed');
  }
  reason(req,response);
});


// Express route for incoming requests for a single input
app.get('/inputs/:id', function (req, res) {
  // send an object as a JSON string
  console.log('id = ' + req.params.id);
  res.send(inputs[req.params.id]);
}); // apt.get()

// Express route for incoming requests for a list of all inputs
app.get('/inputs', function (req, res) {
  // send an object as a JSON string
  console.log('all inputs prueba');
  res.status(200).send(inputs);
}); // apt.get()

app.get('/example', function (req, res) {
  // send an object as a JSON string
  console.log('example');
  console.log(req.query);
    
  var ejemplo =  new example();
  var ruleList = '{ "list":'+ req.query.rules + '}';
  var fact = JSON.parse(req.query.facts);
  
  console.log('parseados');
  
  //console.log(ruleList);
  console.log(fact);
  
  //ejemplo.setRules(req.query.rules);
  ejemplo.setFacts(fact);
  
  ejemplo.razonamientoE(function(returnValor){
	res.status(200).send(returnValor);
  });
  //console.log(r == undefined);
  //res.status(200).send(r);
}); // apt.get()


app.get('/prolog_test', function (req, res) {
  // send an object as a JSON string
  console.log('prolog');
  
	var exec = require('child_process').exec;

	
	exec("sh ./prolog_call.sh pl_rules/test.pl", 
		function(error, stdout, stderr) { 
		
		var returnValor = {value: stdout};
		console.log(returnValor);
		res.status(200).send(returnValor);
	});
});

app.get('/prolog', function (req, res) {
  // send an object as a JSON string
  console.log('prolog');
  
	var p = new parser();
	p.parse(req.query.rules,req.query.facts);

	
	exec("sh ./prolog_call.sh pl_rules/test.pl", 
		function(error, stdout, stderr) { 
		
		var returnValor = {value: stdout};
		console.log(returnValor);
		res.status(200).send(returnValor);
	});
});

app.get('/investigator', function (req, res) {
  // send an object as a JSON string
	console.log('investigator');
	var http = require('http');

	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
	  host: '192.168.2.237',
	  port:'8080',
	  path: '/temperature'
	};

	console.log('investigator2');
	callback = function(response) {
	  var str = '';

	  //another chunk of data has been recieved, so append it to `str`
	  response.on('data', function (chunk) {
		  console.log('investigator6');
		str += chunk;
	  });

	  //the whole response has been recieved, so we just print it out here
	  response.on('end', function () {
		  console.log('investigator5');
		res.status(200).send(str);
	  });
	}
	console.log('investigator3');
	http.request(options, callback).end();
 
	console.log('investigator4');

}); 

// Express route for incoming requests for a list of all inputs
app.get('/razonamientoE', function (req, res) {
  // send an object as a JSON string
  console.log('razonamientoE');
  var ejemplo =  new example();
  ejemplo.razonamientoE(function(returnValor){
	res.status(200).send(returnValor);
  });
  //console.log(r == undefined);
  //res.status(200).send(r);
}); // apt.get()

// Express route for any other unrecognised incoming requests
app.get('*', function (req, res) {
  res.status(404).send('Unrecognised API call');
});

// Express route to handle errors
app.use(function (err, req, res, next) {
  if (req.xhr) {
    res.status(500).send('Oops, Something went wrong!');
  } else {
    next(err);
  }
}); // apt.use()

// ------------------------------------------------------------------------
// Start Express App Server
//
app.listen(3000);
console.log('App Server is listening on port 3000');


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

var inputs = [    { pin: '11', gpio: '17', value: 1 },
                  { pin: '12', gpio: '18', value: 0 }
                ];


function reason (request,callback){
  console.log(request);
	console.log('RAZONANDIOOO');
  var r = JSON.stringify(inputs);
  console.log(r);
  callback({value: request });
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
  	res.status(200).send(answer);
  }
  reason(req.query.message,response);
});


app.get('/prolog_test', function (req, res) {
  // send an object as a JSON string
  console.log('prolog');
  
  var exec = require('child_process').exec;
  
  exec("sh ./tools/prolog_call.sh ./pl_rules/test.pl", 
    function(error, stdout, stderr) { 
    console.log('ERROR'+error);
    console.log('STDOUPUT'+stdout);    
    console.log('STDERROR'+stderr);
    var returnValor = {value: stdout};
    console.log(returnValor);
    res.status(200).send(returnValor);
  });
});

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


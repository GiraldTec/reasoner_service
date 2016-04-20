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


function reason (request){
	console.log('RAZONANDIOOO');
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
  	res.status(200).send('{answer : Processed}');
  }
  reason(req,response);
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


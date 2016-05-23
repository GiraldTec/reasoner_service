/**
 * reasoner.js
 * 
 * DESCRIPTION:
 * 
 * 
 * 
 */

// Variables related to REST service
var express   = require('express');
var app  = express();
var bodyParser = require('body-parser');
///////////

// Deprecated variables
var prueba = require('../prueba_node_r');
var example = require('../example_node_r');
var parser = require('../rules_to_prolog');
var inputs = [    { pin: '11', gpio: '17', value: 1 },
                  { pin: '12', gpio: '18', value: 0 }
                ];
///////////

// Varibles related to XBEE experiment
var util = require('util');
var SerialPort = require('serialport').SerialPort;
var xbee_api = require('xbee-api');
///////////



function reason (request,callback){
  //console.log(request.message);
	//console.log('RAZONANDIOOO');
  var json_req = JSON.parse(request);//.message);
  console.log('PARSEADOOO');
  console.log(json_req);

  response = function(answer){
    callback({value: answer });
  }

  if (json_req.language == 'prolog') {
    console.log('PROLOG');
    var PrologReasoner = require('./prolog_reasoner');
    var reasoner = new PrologReasoner();
    console.log('ENTRAMOS');
    reasoner.url_on_message(json_req,response);
  }else if (json_req.language == 'node-rules') {
    console.log('NODE-RULES');
    reasoner.prolog_reason(json_req,response);
  }else{
    callback({value: 'LANGUAGE NOT SPECIFIED'});
  }
};

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the parent directory
//app.use(express.static(__dirname));
app.use(express.static(__dirname+'/../'));

app.use(bodyParser.urlencoded({
  extended: true
}));

// reasoning request
app.post('/reasoner', function (req, res) {
  console.log('Reasoning request');
  //console.log(req.body);
  response = function(answer){
  	res.status(200).send(answer);
  }
  reason(req.body.message,response);
});




app.get('/prolog_test', function (req, res) {
  // send an object as a JSON string
  console.log('prolog');
  
  var exec = require('child_process').exec;
  
  exec("sh ./tools/prolog_call.sh ./pl_rules/test.pl", 
    function(error, stdout, stderr) { 
    var returnValor = {value: stdout};
    res.status(200).send(returnValor);
  });
});

app.get('/curltest', function (req, res) {
  // send an object as a JSON string
  console.log('curltest');

  console.log(req);
  console.log('CURLTESTEANDO');
//  var json_req = JSON.parse(req.query.message);
//  console.log(json_req);
  
  var returnValor = {value: 'kase'};
  res.status(200).send(returnValor);
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


// RADIO REST SERVICE
var C = xbee_api.constants;

var xbeeAPI = new xbee_api.XBeeAPI({
    api_mode: 2
});

var serialport = new SerialPort("/dev/ttyUSB0", {
  baudrate: 9600,
  parser: xbeeAPI.rawParser()
  });

serialport.on('data', function (data) {
    console.log('data received: ' + data);

});

// All frames parsed by the XBee will be emitted here

xbeeAPI.on("frame_object", function (frame) {
  var datos = frame.data.toString();
  console.log(">>", datos);
  console.log(datos);
  response = function(answer){
    console.log(answer);
  }
  console.log(datos.length);
  var json_datos = JSON.parse(datos);
  console.log(json_datos);
  reason(datos,response);
});
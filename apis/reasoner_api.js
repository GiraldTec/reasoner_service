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
function prolog_reason(jsonR,callback){
  var date = new Date().toISOString().
  replace(/T/, '_').      // replace T with a space
  replace(/\..+/, '');    // delete the dot and everything after

  var savefile = "./persistance/files/prolog/"+jsonR.agentName+'_'+date+'.pl';
  //var savefile = "./persistance/files/prolog/"+jsonR.agentName+'.pl';

  console.log(jsonR);

  execute_prolog = function(){
    console.log('prolog');
  
    var exec = require('child_process').exec;
  
    exec("sh ./tools/prolog_call.sh "+ savefile,
      function(error, stdout, stderr) { 
        callback(stdout);
      });
  };

  add_single_resource = function(res, cback){
    var aux1 = res.location.split(':');
    var aux2 = aux1[1].split('/');

    var http = require('http');
    var options = {
      host: aux1[0], // The URL
      port: aux2[0],
      path: '/'+aux2[1]
    };

    http.request(options, function(response){
      var str = '';

      //another chunk of data has been recieved, so append it to `str`
      response.on('data', function (chunk) {
        str += chunk;
      });

      //the whole response has been recieved, so we just print it out here
      response.on('end', function () {
        strJSON = JSON.parse(str);
        var extra_code = '\n';
        extra_code += res.codename + '(' +  strJSON.value + ').\n';
        console.log('Aniadido ::: '+res.resource+' '+res.location+' '+ extra_code);

        var fs = require('fs');

        fs.appendFile( savefile , extra_code, function(err) {
          if(err) {
            console.log(err);
            callback('ERROR UPDATING FILE');
          }else{
            cback();
          }
        });

      });
    }).end();
    
  };

  add_missing_resources = function(list, cback){
    if (list == []){
      console.log('Aniadidos todos');
      cback();
    }else if (list.length == 1){
      
      add_single_resource(list[0],function(){
        cback();
        });

    }else {
      add_single_resource(list[0],function(){
        add_missing_resources(list.slice(1),cback);
      });

    }
  };

  var fs = require('fs');

  fs.writeFile( savefile , jsonR.code, function(err) {
      if(err) {
          console.log(err);
          callback('ERROR WRITING FILE');
      }else{
        console.log("The file was saved!");
        //console.log('{ "list": '+JSON.stringify(jsonR.resources[0])+'}');
        var list_res = jsonR.resources;
        //console.log(list_res == []);
        add_missing_resources(list_res, execute_prolog);
      }
  });
};

function reason (request,callback){
  console.log(request);
	console.log('RAZONANDIOOO');
  var json_req = JSON.parse(request);
  console.log(json_req);

  response = function(answer){
    callback({value: answer });
  }
  if (json_req.language == 'prolog') {
    console.log('PROLOG');
    prolog_reason(json_req,response);
  }else if (json_req.language == 'node-rules') {
    console.log('NODE-RULES');
    prolog_reason(json_req,response);
  }else{
    callback({value: 'LANGUAGE NOT SPECIFIED'});
  }
};

// ------------------------------------------------------------------------
// configure Express to serve index.html and any other static pages stored 
// in the parent directory
//app.use(express.static(__dirname));
app.use(express.static(__dirname+'/../'));


// reasoning request
app.get('/reasoner', function (req, res) {
  console.log('Reasoning request');
  console.log(req.query);
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
    var returnValor = {value: stdout};
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


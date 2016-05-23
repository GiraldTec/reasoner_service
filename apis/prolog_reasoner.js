 function PrologReasoner(){
	var date = new Date().toISOString().
  // We store the code of 
  replace(/T/, '_').      // replace T with a space
  replace(/\..+/, '');    // delete the dot and everything after

  var savefile = './persistance/files/prolog/default_file'+date+'.pl';
  var callback = null;

  function execute_prolog(){
    console.log('prolog');

    var exec = require('child_process').exec;

    exec("sh ./tools/prolog_call.sh "+ savefile,
      function(error, stdout, stderr) { 
        callback(stdout);
      });
  };

  // TODO :: enviar metodo a otro fichero
  function genericHTTPrequest(options, onEnd){
    var http = require('http');
    http.request(options, function(response){
      // An HTTP request begins with a string in which we will store the response
      var str = '';

      //the string may come in the shape of several chuncks. We join them together
      response.on('data', function (chunk) {
        console.log('cogiendo cachito');
        str += chunk;
      });

      // We receive the hole response and we do whatever we want
      response.on('end', function(){
        console.log('recogido el string');
        return onEnd(str);
      });
    }).end();
  };

  function add_missing_resources(list, pointer, cback){
    console.log('SAVEFILEEEEEEEEEEEEEEEEEEEE missing resourceSSSS');
    console.log(savefile);
    if (pointer == 0){
      add_single_resource(list[pointer],function(){
        cback();
      });
    }else {
      console.log(list[pointer]);
      add_single_resource(list[pointer],function(){
        add_missing_resources(list,pointer-1,cback);
      });
    }
  };

  // TODO : passing a seond callback doesnt seem a good idea
  // better practice could be to make more general the callback system or modify the call to this function.. 
  // who knows..
  function add_single_resource(res, cback){
    var aux1 = res.location.split(':');
    var aux2 = aux1[1].split('/');

    
    var options = {
      host: aux1[0], // The URL
      port: aux2[0],
      path: '/'+aux2[1]
    };

    genericHTTPrequest(options,function(str) {
      strJSON = JSON.parse(str);
      var extra_code = '\n';
      extra_code += res.codename + '(' +  strJSON.value + ').';
      console.log('Aniadido ::: '+res.resource+' '+res.location+' '+ extra_code);

      var fs = require('fs');

      console.log('SAVEFILEEEEEEEEEEEEEEEEEEEE');
      console.log(savefile);

      fs.appendFile( savefile , extra_code, function(err) {
        if(err) {
          console.log(err);
          callback('ERROR UPDATING FILE');
        }else{
          return cback();
        }
      });

    });
  };

  function set_savefile_name (name){
    var date = new Date().toISOString().
      replace(/T/, '_').      // replace T with a space
      replace(/\..+/, '');    // delete the dot and everything after

    savefile = "./persistance/files/prolog/"+name+'_'+date+'.pl';
  };

  this.code_on_message = function(jsonRequest,callback1){

    set_savefile_name(jsonRequest.agentName);
    callback = callback1;

    console.log('SAVEFILEEEEEEEEEEEEEEEEEEEE');
    console.log(savefile);

    var fs = require('fs');

    fs.writeFile( savefile , jsonRequest.code+'\n', function(err) {
        if(err) {
            console.log(err);
            callback('ERROR WRITING FILE');
        }else{
          console.log("The file was saved!");
          if (jsonRequest.resources != undefined){
            var list_res = jsonRequest.resources;
            add_missing_resources(list_res, list_res.length-1, function(){
              execute_prolog();
            });
          }else{
            execute_prolog();
          }
        }
    });
  };

  this.url_on_message = function(jsonRequest,callback1){
    
    console.log(jsonRequest);
    console.log("ESA ES LA REQUEST");

    set_savefile_name(jsonRequest.agentName);
    callback = callback1;

    var aux1 = jsonRequest.code.split(':');
    var aux2 = aux1[1].split('/');

    var options = {
      host: aux1[0], // The URL
      port: aux2[0],
      path: '/'+aux2[1]
    };    

    genericHTTPrequest(options,function(str) {

      var strJSON = JSON.parse(str);

      console.log(strJSON);
      console.log("ESE FUE EL JSON QUE RECIBI");

      var fs = require('fs');
      fs.writeFile( savefile , strJSON.code+'\n', function(err) {
          if(err) {
              console.log(err);
              callback('ERROR WRITING FILE');
          }else{
            console.log("The file was saved!");
            if (jsonRequest.resources != undefined){
              var list_res = jsonRequest.resources;
              add_missing_resources(list_res, list_res.length-1, function(){
                execute_prolog();
              });
            }else{
              execute_prolog();
            }
          }
      });
    });
  };

  this.id_on_message = function(jsonRequest,callback1){
    
    set_savefile_name(jsonRequest.agentName);
    callback = callback1;

    var aux1 = jsonRequest.code.split(':');
    var aux2 = aux1[1].split('/');

    var options = {
      host: aux1[0], // The URL
      port: aux2[0],
      path: '/'+aux2[1]
    };    

    genericHTTPrequest(options,function(str) {

      var strJSON = JSON.parse(str);

      var fs = require('fs');
      fs.writeFile( savefile , strJSON.code+'\n', function(err) {
          if(err) {
              console.log(err);
              callback('ERROR WRITING FILE');
          }else{
            console.log("The file was saved!");
            if (jsonRequest.resources != undefined){
              var list_res = jsonRequest.resources;
              add_missing_resources(list_res, list_res.length-1, function(){
                execute_prolog();
              });
            }else{
              execute_prolog();
            }
          }
      });
    });
  };




};
module.exports = PrologReasoner;
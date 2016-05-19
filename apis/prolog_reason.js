/*
* URL-ON-MESSAGE
* If the message contains CODE_URL or CODE_URL + RESOURCE_URLs
* Retrieve > Save > (Complete) > Execute the code in a file
*/



/*
* ID-ON-MESSAGE
* If the message contains CODE_ID or CODE_ID + RESOURCE_URLs
* Retrieve > Save > (Complete) > Execute the code in a file
*/



/*
* CODE-ON-MESSAGE
* If the message contains CODE or CODE + RESOURCE_URLs
* Save > (Complete) > Execute the code in a file
*/
exports.code_on_message = function (jsonR,callback){

  var date = new Date().toISOString().
    replace(/T/, '_').      // replace T with a space
    replace(/\..+/, '');    // delete the dot and everything after
  var savefile = "./persistance/files/prolog/"+jsonR.agentName+'_'+date+'.pl';

  console.log(jsonR);

  var fs = require('fs');

  fs.writeFile( savefile , jsonR.code+'\n', function(err) {
      if(err) {
          console.log(err);
          callback('ERROR WRITING FILE');
      }else{
        console.log("The file was saved!");
        if (jsonR.resources != undefined){
          var list_res = jsonR.resources;
          add_missing_resources(savefile, callback, list_res, list_res.length-1, function(){
            execute_prolog(savefile, callback);
          });
        }else{
          execute_prolog(savefile, callback);
        }
      }
  });
};

function execute_prolog(file, callback){
  console.log('prolog');

  var exec = require('child_process').exec;

  exec("sh ./tools/prolog_call.sh "+ file,
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
      str += chunk;
    });

    // We receive the hole response and we do whatever we want
    response.on('end', function(){
      return onEnd(str);
    });
  }).end();
};

function add_missing_resources(savefile, callback, list, pointer, cback){
  if (pointer == 0){
    add_single_resource(savefile, callback, list[pointer],function(){
      cback();
    });
  }else {
    console.log(list[pointer]);
    add_single_resource(savefile, callback, list[pointer],function(){
      add_missing_resources(savefile, callback, list,pointer-1,cback);
    });
  }
};


// TODO : passing a seond callback doesnt seem a good idea
// better practice could be to make more general the callback system or modify the call to this function.. 
// who knows..
function add_single_resource(savefile, callback, res, cback){
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
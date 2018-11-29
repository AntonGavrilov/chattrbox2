var http = require('http');
var fs = require('fs');
var extract = require('./extract');
const mime = require('mime/lite');


var handleError = function(err, res){
  filePath = extract("/404.html");
  console.log(filePath);
  handleDataFromFile(filePath, res);
}

var server = http.createServer(function(req, res){

  var filePath = extract(req.url);
  handleDataFromFile(filePath, res);
})


var handleDataFromFile = function(filePath, res){
  console.log(mime.getType(filePath));

  fs.readFile(filePath, function(err, data){
    if(err){
      handleError(err, res);
      return;
    }else{
      res.end(data)
    }
  })
}

console.log('Hello.');
server.listen(3002);

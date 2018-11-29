var http = require('http');
var fs = require('fs');
var extract = require('./extract');

var handleError = function(err, res){
  filePath = extract("/404.html");
  console.log(filePath);
  fs.readFile(filePath, function(err, data){
      res.end(data)
  })
}

var server = http.createServer(function(req, res){

  var filePath = extract(req.url);

  fs.readFile(filePath, function(err, data){
    if(err){
      handleError(err, res);
      return;
    }else{
      res.end(data)
    }
  })
})
console.log('Hello.');

server.listen(3002);

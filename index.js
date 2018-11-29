var http = require('http');
var fs = require('fs');
var extract = require('./extract');

var handleError = function(err, res){
  res.writeHead(404);
  res.end();
}

var server = http.createServer(function(req, res){

  var filePath = extract(req.url);

  fs.readFile(filePath, function(err, data){
    if(err){
      handleError(err, res);
      console.log('error');
      return;
    }else{
      res.end(data)
    }
  })
})
console.log('Hello.');

server.listen(3001);

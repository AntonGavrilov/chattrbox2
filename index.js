var http = require('http');
var fs = require('fs');

var server = http.createServer(function(req, res){
  fs.readFile('app/index.html', function(err, data){
    res.end(data);
  })
})

server.listen(3000);

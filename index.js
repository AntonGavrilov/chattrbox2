var server = require('./server');
//var wss = require('./websockets-server');


var myserver1 = new server(3003);

myserver1.Start(function(res){
  console.log("hello from my server")
}, "app")

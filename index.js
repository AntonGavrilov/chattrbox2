var server = require('./server');
var wss = require('./ws-server/websockets-server');

var myserver1 = new server(3003);

myserver1.Start(function(res){
}, "app")

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3002;

var ws = new WebSocketServer({
  port: port
});

var messages = [];

console.log('websockets server stared');

ws.on('connection', function(socket){
  console.log('client connection esteblished');

  messages.forEach((msg)=>{
    socket.send(msg);
  })

  socket.on('message', function(data){
    console.log('message received: ' + data);
    messages.push(data);
    ws.clients.forEach((clientSocket)=>{
      clientSocket.send(data);
    })
    });
});

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var Bot = require('./bot');
var port = 3002;
var secretPassword = "antosha"
var activeUsers = [];
var messages = [];
let roomList = new Set();

var ws = new WebSocketServer({
  port: port
});



console.log('websockets server stared');

ws.subscribeVerification = function(fn) {
  if (fn != undefined)
    this.onVerification = fn;
}


ws.on('connection', function(socket, req) {
  console.log('client connection esteblished');
  socket.room = "mainroom";

  socket.on('message', function(data) {
    console.log('message received: ' + data);
    var message = {};
    message = JSON.parse(data);

    this.room = message.room;
    message['text'] = data;
    messages.push(message);
    roomList.add(this.room);

    if(message.messageType == "message"){
      this.username = message.user;
      ws.clients.forEach((clientSocket) => {
        if(clientSocket.room == this.room){
           clientSocket.send(data);
        }
      })

    }else if(message.messageType == "roomList"){
      message.message = JSON.stringify(roomList);
      socket.send(JSON.stringify(message));
    }
  });
});

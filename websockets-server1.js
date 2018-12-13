var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var Bot = require('./bot');
var port = 3002;
var secretPassword = "antosha"
var activeUsers = {};

var ws = new WebSocketServer({
  port: port
});

var messages = [];

console.log('websockets server stared');

ws.subscribeVerification = function(fn){
  if(fn != undefined)
    this.onVerification = fn;
}

var bot = new Bot('http://localhost:3002', "vasya",ws);

ws.on('connection', function(socket, req){
      console.log('client connection esteblished');
      socket.clientIsVerified = true;
      socket.send("enter your name:");

      socket.on('message', function(data) {
          console.log('message received: ' + data);

          if (this.clientIsVerified == false){
              this.clientIsVerified = true;
              this.name = data;
              ws.onVerification(socket);
              messages.forEach((msg) => {
                this.send(msg.username + ": " + msg.text);
              })
            }else
            {
              var message = {};
              message['username'] = this.name;
              message['text'] = data;
              messages.push(message);
              ws.clients.forEach((clientSocket) => {
                if (socket != clientSocket &&
                  clientSocket.clientIsVerified) {
                  clientSocket.send(message.username + ": " + message.text);
                }
              })
            }
          });
      });

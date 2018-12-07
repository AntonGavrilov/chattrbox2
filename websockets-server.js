var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3002;
var secretPassword = "antosha"

var ws = new WebSocketServer({
  port: port
});

var messages = [];

console.log('websockets server stared');

ws.on('connection', function(socket){
  console.log('client connection esteblished');

  socket.clientIsVerified = false;
  socket.on('message', function(data){
    console.log('message received: ' + data);

      if(this.clientIsVerified == false
          && data == secretPassword)
      {
        this.clientIsVerified = true;
        messages.forEach((msg)=>{
          this.send(msg);
        })
      }
      if(this.clientIsVerified)
      {
        messages.push(data);
        ws.clients.forEach((clientSocket)=>{
            if(socket != clientSocket
                && clientSocket.clientIsVerified)
              clientSocket.send(data);
          })
      }else
      {
        this.send("This is the silent chat. Password is required")
      }
    });
});

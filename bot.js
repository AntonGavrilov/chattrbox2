var WebSocket = require('ws');

var Bot = function(serverName, serverSoket){
  this.socket = new WebSocket(serverName);
  this.serverSoket = serverSoket;

  this.socket.on('open', function open(){
    //this.socket.send("bot");
    this.serverSoket.onUserVerification(function (clientSocket){

      //clientSocket.send("hi " + clientSocket.name + "!!!")
    })
  }.bind(this));

  this.socket.on('message', function(data){
    //this.socket.send(data);
  }.bind(this));
}

module.exports = Bot;

var WebSocket = require('ws');

var Bot = function(serverName, name, serverSoket){
  this.socket = new WebSocket(serverName);
  this.serverSoket = serverSoket;
  this.name = name;
  this.questions = {};

  this.questions["bot"] = "vse norm bratan!!!";
  this.serverSoket.subscribeVerification(function (clientSocket){
    if(clientSocket.name != this.name)
      this.socket.send("hi " + clientSocket.name + "!!!")
  }.bind(this))

  this.socket.on('open', function open(){
    this.socket.send(name)

  }.bind(this));

  this.socket.on('message', function(data){

  }.bind(this));
}

module.exports = Bot;

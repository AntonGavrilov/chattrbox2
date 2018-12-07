var WebSocket = require('ws');

var Bot = function(serverName){
  this.socket = new WebSocket(serverName);

  this.socket.on('open', function open(){
    //password
    this.socket.send("antosha");
    //hello
    this.socket.send("hi all. I'm dammy bot ");
  }.bind(this));

  this.socket.on('message', function(data){
    this.socket.send(data);
  }.bind(this));
}

module.exports = Bot;

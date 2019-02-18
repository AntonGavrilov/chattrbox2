var clientmodule = require('./chat-client');

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3002;

class Server{
  constructor(port) {
    this.messages = new Map();
    this.clients = new Map();
    this.roomList = {};
    this.mainRoom = new clientmodule.Room("main");
    this.roomList[this.mainRoom.name] = this.mainRoom;
    this.socket = new WebSocketServer({
      port: port
    });

    this.socket.on('connection', (socket, req) => {
      var newclient = new clientmodule.ChatClient(socket);

      newclient.registerMessageHandler((message)=>{
        if(message.messageType == "message")
          this.messages.set(this.currentRoom, message);
      })

      newclient.joinRoom(this.mainRoom);
      this.clients.set(socket, newclient);

      newclient.on("joinRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var room = this.roomList[data];
        var currentClient = this.clients.get(socket);
        currentClient.joinRoom(room);
        room.addUser(currentUser);
      })


      newclient.on("newRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var newRoom = new clientmodule.Room(message.message);
        this.roomList[newRoom.name] = this.mainRoom;
        var currentClient = this.clients.get(socket);
        currentClient.joinRoom(newRoom);
      })


      newclient.on("roomList", (data) => {
        var message = {};
        message = JSON.parse(data);
        var curRoomList = [];
        newclient.roomList.forEach(curRoom => {
          curRoomList.push(curRoom.name)
        })
        message.message = JSON.stringify(curRoomList);
        socket.send(JSON.stringify(message));
      })

      newclient.on("message", (data) => {

        var message = {};
        message = JSON.parse(data);

        var currentClient = this.clients.get(socket);
        var currentRoom = this.roomList[message.room];

        if (currentRoom != undefined &&
          currentRoom != currentClient.currentRoom)
          currentClient.changeCurrentRoom(currentRoom);

        var message = {};
        message = JSON.parse(data);
        message['text'] = data;
        this.clients.forEach(function(user, socket, map){
          var currentClient = this.clients.get(socket);
          if (user.roomList.includes(currentClient.currentRoom)) {
            socket.send(data);
          }
        },this)
      })
    })
  }
}



console.log('websockets server stared');
let serverApp = new Server(port);

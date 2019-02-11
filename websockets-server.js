var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var Bot = require('./bot');
var port = 3002;
var activeUsers = new Map();
var messages = [];
let roomList = {};

class User {
  constructor(socket, name) {
    this.name = name;
    this.socket = socket;
    this.roomList = [];
  }

  joinRoom(room) {
    this.currentRoom = room
    this.roomList.push(room);
  }

  changeCurrentRoom(room) {
    this.currentRoom = room
  }

}

class Room {
  constructor(name) {
    this.name = name;
    this.userList = [];
  }
  addUser(user) {
    this.userList.push(user);
  }
}


var mainRoom = new Room("main");
roomList[mainRoom.name] = mainRoom;

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

  var newUser = new User(socket, "anonimus user");
  newUser.joinRoom(mainRoom);
  activeUsers.set(socket, newUser);
  mainRoom.addUser(newUser);

  socket.on('message', function(data) {
      console.log('message received: ' + data);
      var message = {};
      message = JSON.parse(data);

      var currentUser = activeUsers.get(socket);
      var currentRoom = roomList[message.room];

      if(currentRoom != undefined)
        currentUser.changeCurrentRoom(currentRoom);


      if (message.messageType == "joinRoom") {
        var room = roomList[message.message];
        currentUser.joinRoom(room);
        room.addUser(currentUser);
      } else if (message.messageType == "newRoom") {
        var newRoom = new Room(message.message);
        currentUser.joinRoom(newRoom);
        roomList[newRoom.name] = newRoom;
      } else if (message.messageType == "userInfo") {

      } else if (message.messageType == "message") {
        message['text'] = data;
        messages.push(message);
        activeUsers.forEach((user, socket, map) => {
          if (currentUser.currentRoom == user.currentRoom){
            socket.send(data);
          }
        })
      } else if (message.messageType == "roomList") {
        var curRoomList = [];
        currentUser.roomList.forEach(curRoom => {
          curRoomList.push(curRoom.name)
        })
        message.message = JSON.stringify(curRoomList);
        socket.send(JSON.stringify(message));
    }
  });
});

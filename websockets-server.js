var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var Bot = require('./bot');
var port = 3002;
var activeUsers = new Map();
var messages = [];
let roomList = {};
var currentUser;
var currentRoom;

class Emmiter {
  constructor() {
    this.events = [];
  }

  subscribe(eventName, fn) {
    if (this.events[eventName] == null) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(fn);
  }

  emit(eventName, data) {
    var fnarr = this.events[eventName];

    if (fnarr) {
      fnarr.forEach((fn) => {
        fn.call(this, data)
      })
    }
  }
}

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

var emmiter = new Emmiter();

ws.on('connection', function(socket, req) {
  console.log('client connection esteblished');

  var newUser = new User(socket, "anonimus user");
  newUser.joinRoom(mainRoom);
  activeUsers.set(socket, newUser);
  mainRoom.addUser(newUser);

  emmiter.subscribe("joinRoom", (data) =>{
    var room = roomList[data.message];
    currentUser.joinRoom(room);
    room.addUser(currentUser);

  })


  emmiter.subscribe("newRoom", (data) =>{
    var message = {};
    message = JSON.parse(data);
    var newRoom = new Room(message.message);
    currentUser.joinRoom(newRoom);

  })

  emmiter.subscribe("joinRoom", (data) =>{
    var message = {};
    message = JSON.parse(data);
    var room = roomList[data.message];
    currentUser.joinRoom(room);
    room.addUser(currentUser);

  })

  emmiter.subscribe("roomList", (data) =>{
    var message = {};
    message = JSON.parse(data);

    var curRoomList = [];
    currentUser.roomList.forEach(curRoom => {
      curRoomList.push(curRoom.name)
    })
    message.message = JSON.stringify(curRoomList);
    socket.send(JSON.stringify(message));

  })

  emmiter.subscribe("message", (data) =>{
    var message = {};
    message = JSON.parse(data);
    message['text'] = data;
    messages.push(message);
    activeUsers.forEach((user, socket, map) => {
      if (user.roomList.includes(currentUser.currentRoom)) {
        socket.send(data);
      }
    })
  })


  socket.on('message', function(data) {
    console.log('message received: ' + data);
    var message = {};
    message = JSON.parse(data);

    currentUser = activeUsers.get(socket);
    currentRoom = roomList[message.room];

    if (currentRoom != undefined &&
      currentRoom != currentUser.currentRoom)
      currentUser.changeCurrentRoom(currentRoom);

    emmiter.emit(message.messageType, data)
    /*
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
        if (user.roomList.includes(currentUser.currentRoom)) {
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
    */
  });
});

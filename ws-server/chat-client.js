
class ChatClient{
  constructor(socket) {
    this.name = "anonimus client";
    this.socket = socket;
    this.roomList = [];
    this.emmiter = new EventClientEmmiter();
    this.currentRoom = {};
    this.lastSeenMsgMap = {};
    this.messages = {};
  }

  registerMessageHandler(handlerFunction){
    this.socket.onmessage = (socketmessage)=>{

      var message = {};
      message = JSON.parse(socketmessage.data);
      this.lastSeenMsgMap[message.room] = message.lastSeenMsgDate;
      handlerFunction(message);
      this.emmiter.emit(message.messageType, socketmessage.data)

      console.log('message received: ' + socketmessage.data);
    }
  }

  on(eventName, fn) {
    this.emmiter.subscribe(eventName, fn);
  }

  joinRoom(room) {
    room.addClient(this);
    this.currentRoom = room
    this.roomList.push(room);
  }

  changeCurrentRoom(room) {
    this.currentRoom = room
  }

  pushMessageToCache(message){
    var messagearr = [];

    if (this.messages[message.room] != undefined)
      messagearr = this.messages[message.room];

    messagearr.push(message);
    this.messages[message.room] = messagearr;

  }
}

class Room {
  constructor(name) {
    this.name = name;
    this.userList = [];
  }
  addClient(user) {
    this.userList.push(user);
  }
}

class EventClientEmmiter {
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

module.exports.ChatClient = ChatClient;
module.exports.Room = Room;

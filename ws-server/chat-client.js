
class ChatClient{
  constructor(socket) {
    this.name = "anonimus client";
    this.socket = socket;
    this.roomList = [];
    this.emmiter = new EventClientEmmiter();
    this.currentRoom = {};
    this.lastOutputMsgIndex = 0;
    this.firstOutputMsgIndex = 0;
    this.lastSeenMsgMap = {};
    this.messages = {};
  }

  registerMessageHandler(handlerFunction){
    this.socket.onmessage = (socketmessage)=>{

      var message = {};
      message = JSON.parse(socketmessage.data);
      handlerFunction(message);
      this.emmiter.emit(message.messageType, socketmessage.data)

      console.log('message received: ' + socketmessage.data);
    }
  }

  sendMessage(message){
    this.pushMessageToCache(message);
    socket.send(data);
  }

  readMessage(id, room){
    var cachedMessage = this.getCachedMessageById(id, room);
    cachedMessage.isNewMessage = false;
    this.lastSeenMsgMap[cachedMessage.room] = cachedMessage.id;

    return cachedMessage;
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

  updateMessageInCache(message){
    var messagearr = [];

    if (this.messages[message.room] != undefined)
      messagearr = this.messages[message.room];

    var updatedMessage = messagearr.splice(messagearr.indexOf(message), 1, message);

  }


  getCachedMessageById(messageId, roomId){
    var messagearr = [];

    if (this.messages[roomId] != undefined)
      messagearr = this.messages[roomId];

    var result = messagearr.slice(0).filter(m=>{
      if (m.id == messageId) {
        return m;
    }
  })

    if(result.length > 0){
      return result[0];
    }else{
      return null;
    }
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

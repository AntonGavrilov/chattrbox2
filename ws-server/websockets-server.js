var clientmodule = require('./chat-client');

var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3002;

class Server {
  constructor(port) {
    this.messages = {};
    this.clients = new Map();
    this.roomList = {};
    this.mainRoom = new clientmodule.Room("main");
    this.roomList[this.mainRoom.name] = this.mainRoom;
    this.socket = new WebSocketServer({
      port: port
    });

    this.socket.on('connection', (socket, req) => {
      var newclient = new clientmodule.ChatClient(socket);

      newclient.registerMessageHandler((message) => {

      })

      this.clients.set(socket, newclient);

      newclient.on("joinRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var room = this.roomList[message.message];
        var currentClient = this.clients.get(socket);
        currentClient.joinRoom(room);

        //fill message history from current joined room
        //+
        var messageHistory = this.messages[message.room];

        if (messageHistory) {
          messageHistory.forEach(m => {
            currentClient.pushMessageToCache(m);
          }, this)
        }
        //-


        message.message = message.message;
        socket.send(JSON.stringify(message));
      })

      newclient.on("RoomNewMessageCount", (data) => {
        var message = {};
        message = JSON.parse(data);

        var currentClient = this.clients.get(socket);

        var outputarr = [];
        var initalObj = {};

        Object.keys(currentClient.messages).forEach(room => {
          var messagearr = currentClient.messages[room];
          initalObj[room] = 0;

          var output = messagearr.reduce((output, m, index, arr) => {
              if (m.isNewMessage)
                output[room] = output[room] + 1;
              return output;
            },
            initalObj
          )
        }, this)
        message.message = JSON.stringify(initalObj);
        socket.send(JSON.stringify(message));
      })


      newclient.on("readMessage", (data) => {
        var message = {};
        message = JSON.parse(data);

        var currentClient = this.clients.get(socket);

        var messageId = message.message;

        var cachedMessage = currentClient.readMessage(messageId, message.room);
        message.message = JSON.stringify(cachedMessage);
        socket.send(JSON.stringify(message));
      })


      newclient.on("messageList", (data) => {
        var message = {};
        message = JSON.parse(data);

        var currentClient = this.clients.get(socket);

        var lastSeenMsg = currentClient.lastSeenMsgMap[message.room];

        var cachedMessages = currentClient.messages[message.room];

        var lstReadMsg = currentClient.getCachedMessageById(lastSeenMsg, message.room);

        var outputMessages = [];

        if (cachedMessages) {
          var msgIndex = lstReadMsg == null ? 0 : cachedMessages.indexOf(lstReadMsg);
          var startmsgindex = (msgIndex - 20) <= 0 ? 0 : msgIndex - 20;
          var endmsgindex = Math.min(startmsgindex + 20, cachedMessages.length);
          var outputMessages = cachedMessages.slice(startmsgindex, endmsgindex);
        }
        outputMessages.forEach(m => {
          socket.send(JSON.stringify(m));
        })
      })



      newclient.on("oldMessages", (data) => {

        var message = {};
        message = JSON.parse(data);

        var currentClient = this.clients.get(socket);

        var cachedMessages = currentClient.messages[message.room];

        var firstClientMsg = currentClient.getCachedMessageById(message.message, message.room);

        var firstClientMsgIndex = cachedMessages.indexOf(firstClientMsg);

        var outputMessages = [];

        var firstOldMsgIndex = firstClientMsgIndex - 1;

        if(cachedMessages && (firstOldMsgIndex > 0))
        {
          var startmsgindex = Math.max(firstOldMsgIndex - 20, 0)
          var endmsgindex = firstOldMsgIndex;
          var outputMessages = cachedMessages.slice(startmsgindex, endmsgindex);
        }

        outputMessages.reverse();

        outputMessages.forEach(m => {
          m.append = false;
          socket.send(JSON.stringify(m));
        })
      }
    )
    newclient.on("newMessages", (data) => {

      var message = {};
      message = JSON.parse(data);

      var currentClient = this.clients.get(socket);

      var cachedMessages = currentClient.messages[message.room];

      var firstClientMsg = currentClient.getCachedMessageById(message.message, message.room);

      var firstClientMsgIndex = cachedMessages.indexOf(firstClientMsg);

      var outputMessages = [];

      var firstLastMsgIndex = firstClientMsgIndex + 1;

      if(cachedMessages && (firstLastMsgIndex < cachedMessages.length))
      {
        var startmsgindex = firstLastMsgIndex;
        var endmsgindex = Math.min(firstLastMsgIndex + 20, cachedMessages.length);
        var outputMessages = cachedMessages.slice(startmsgindex, endmsgindex);
      }


      outputMessages.forEach(m => {
        m.append = true;
        socket.send(JSON.stringify(m));
      })
    }
  )


      newclient.on("newRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var newRoom = new clientmodule.Room(message.message);
        this.roomList[newRoom.name] = newRoom;
        var currentClient = this.clients.get(socket);
        currentClient.joinRoom(newRoom);
        message.message = newRoom.name;
        socket.send(JSON.stringify(message));
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


        this.pushMessageToCache(message);

        if (currentRoom != undefined &&
          currentRoom != currentClient.currentRoom)
          currentClient.changeCurrentRoom(currentRoom);

        this.clients.forEach(function(user, socket, map) {
          var currentClient = this.clients.get(socket);
          if (user.roomList.includes(currentClient.currentRoom) &&
            socket.readyState === WebSocket.OPEN) {
            var m = Object.assign({}, message);
            currentClient.pushMessageToCache(m);
            socket.send(data);
          }
        }, this)
      })
    })
  }

  pushMessageToCache(message){
    var messagearr = [];

    if (this.messages[message.room] != undefined)
      messagearr = this.messages[message.room];

    messagearr.push(message);
    this.messages[message.room] = messagearr;
  }
}



console.log('websockets server stared');
let serverApp = new Server(port);

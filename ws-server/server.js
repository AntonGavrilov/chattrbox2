var WebSocket = require('ws');
var WebSocketServer = WebSocket.Server;
var port = 3002;

class Server{
  constructor() {
    this.activeUsers = new Map();
    this.messages = [];
    this.clients = new Map();;
    this.roomList = {};
    this.socket = new WebSocketServer({
      port: port
    });

    this.mainRoom = new Room("main");

    this.socket.on('connection', function(socket, req) {
      var newclient = new Client(socket);

      newclient.joinRoom(mainRoom);
      activeUsers.set(socket, newclient);
      mainRoom.addUser(newclient);


      newclient.on("joinRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var room = this.roomList[data];
        currentUser.joinRoom(room);
        room.addUser(currentUser);
      })


      newclient.on("newRoom", (data) => {
        var message = {};
        message = JSON.parse(data);
        var newRoom = new Room(data);
        this.roomList.push(newRoom);
        this.currentUser.joinRoom(newRoom);
      })


      newclient.on("roomList", (data) => {
        var message = {};
        var curRoomList = [];
        this.roomList.forEach(curRoom => {
          curRoomList.push(curRoom.name)
        })
        message.message = JSON.stringify(curRoomList);
        socket.send(JSON.stringify(message));
      })

      emmiter.subscribe("message", (data) => {

        var currentUser = activeUsers.get(socket);
        var currentRoom = roomList[message.room];

        if (currentRoom != undefined &&
          currentRoom != currentUser.currentRoom)
          currentUser.changeCurrentRoom(currentRoom);

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

      this.clients.push(newclient);

    })
  }
}

import {
  ret as socket
} from './ws-client';
import {
  UserStore,
  MessageStore,
  LastSeenMsgDateStore
} from './storage';
import {
  ChatForm,
  ChatList,
  RoomList,
  promptForUsername
} from './dom';
const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]'
const LIST_SELECTOR = '[data-chat="message-list"]'
const ROOMLIST_SELECTOR = '[data-chat="room-list"]'
let currentRoom = 'main';

let userStore = new UserStore('x-chattrbox/u');
let messageStore = new MessageStore('x-chattrbox/m');
let lastSeenMsgDateStore = new LastSeenMsgDateStore('x-chattrbox/lastseenmsg');
let username = userStore.get();

if (!username) {
  username = promptForUsername();
  userStore.set(username)
}

class ChatApp {
  constructor() {
    socket.init('ws://localhost:3002');
    this.chatFrom = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);
    this.roomList = new RoomList(ROOMLIST_SELECTOR);

    this.roomList.registerMessageUpdateMsgCountHandler((element) => {
      var messageListMessage = new ChatMessage("");
      messageListMessage.messageType = "RoomNewMessageCount";
      socket.sendMessage(messageListMessage.serialize());
    })

    var messages = messageStore.get(currentRoom);

    for (var i = 0; i < messages.length; i++) {
      let message = new ChatMessage(messages[i], "message");
      message.isNewMessage = false;
      this.chatList.drawMessage(message.serialize());
      lastSeenMsgDateStore.set(message.timestamp, currentRoom);
    }



    socket.registerOpenHandler(() => {
      this.chatFrom.init((data) => {
        let message = new ChatMessage({
          message: data,
          messageType: "message",
          isNewMessage: true
        });
        socket.sendMessage(message.serialize());
      })

      var roomListMessage = new ChatMessage("");
      roomListMessage.messageType = "roomList";
      socket.sendMessage(roomListMessage.serialize());

    })

    socket.registerMassageHandler(data => {
      let message = new ChatMessage(data);

      if (message.messageType == "message") {
        if (message.room == currentRoom) {
          this.chatList.drawMessage(message.serialize());
          lastSeenMsgDateStore.set(message.id, currentRoom);
          let readMessage = new ChatMessage({
            message: message.id,
            messageType: "readMessage",
            isNewMessage: true
          });

          socket.sendMessage(readMessage.serialize())

          console.log(message.timestamp);
        }
      } else if (message.messageType == "roomList") {
        var rooms = JSON.parse(message.message);
        this.roomList.drawRoomList(rooms, currentRoom);
      } else if (message.messageType == "joinRoom") {
        var newRoom = message.message;
        currentRoom = newRoom;
        this.roomList.drawRoom(newRoom, currentRoom);
      } else if (message.messageType == "newRoom") {
        var newRoom = message.message;
        currentRoom = newRoom;
        this.roomList.drawRoom(newRoom, currentRoom);
      } else if (message.messageType == "RoomNewMessageCount") {
        var roomsnewmessage = JSON.parse(message.message);
        this.roomList.updateNewMsgCount(roomsnewmessage);
      } else if (message.messageType == "messageList") {
        var massgeList = JSON.parse(message.message);

        var messages = messageStore.get(currentRoom);

        massgeList.forEach((m) => {
          let message = new ChatMessage(m, "message");
          this.chatList.drawMessage(message.serialize());
          lastSeenMsgDateStore.set(message.timestamp, currentRoom);
        }, this)
      }
    })

    this.chatFrom.registerNewRoomHandler(() => {
      var room = prompt('Enter a room name');
      if (room) {
        this.chatList.clearChatList();
        var newRoomMessage = new ChatMessage("");
        newRoomMessage.messageType = "newRoom";
        newRoomMessage.message = room;
        socket.sendMessage(newRoomMessage.serialize())
      }
    })

    this.chatFrom.registerJoinRoomHandler(() => {
      var room = prompt('Enter a room name');
      this.chatList.clearChatList();
      var newRoomMessage = new ChatMessage("");
      newRoomMessage.messageType = "joinRoom";
      newRoomMessage.message = room;
      socket.sendMessage(newRoomMessage.serialize())
    })


    this.roomList.registerRoomChangeHandler((newRoom) => {
      if (currentRoom != newRoom) {
        currentRoom = newRoom;
        this.chatList.clearChatList();
        var messageListMessage = new ChatMessage("");
        messageListMessage.messageType = "messageList";
        socket.sendMessage(messageListMessage.serialize());
      }
    })

    socket.registerCloserHandler(e => {
      console.log(socket.readyState);
    })
  }
  isAlive() {
    if (socket.getState() == 1) {
      console.log("ret true");
      return true;
    }
    console.log("ret false");
    return false;
  }
}

class ChatMessage {
  constructor({
    id: id = '_' + Math.random().toString(36).substr(2, 9),
    message: m,
    messageType: mt,
    user: u = username,
    room: r = currentRoom,
    timestamp: t = (new Date()).getTime(),
    isNewMessage: isnew,
    lastSeenMsgDate: lastSeenMsgDate = lastSeenMsgDateStore.get(currentRoom)
  }) {
    this.id = id;
    this.message = m;
    this.user = u;
    this.timestamp = t;
    this.room = r,
      this.messageType = mt,
      this.isNewMessage = isnew,
      this.lastSeenMsgDate = lastSeenMsgDate
  }

  readMessage() {
    this.isNewMessage = false
  }

  serialize() {
    return {
      id: this.id,
      user: this.user,
      message: this.message,
      room: this.room,
      timestamp: this.timestamp,
      isNewMessage: this.isNewMessage,
      messageType: this.messageType,
      lastSeenMsgDate: this.lastSeenMsgDate
    }

  }
}

export {
  ChatApp
};

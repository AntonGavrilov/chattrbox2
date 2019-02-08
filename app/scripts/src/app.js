import {
  ret as socket
} from './ws-client';
import {
  UserStore,
  MessageStore
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

let userStore = new UserStore('x-chattrbox/u');
let messageStore = new MessageStore('x-chattrbox/m');
let username = userStore.get();
let currentRoom = 'mainRoom';

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

    var messages = messageStore.get();

    for (var i = 0; i < messages.length; i++) {
      let message = new ChatMessage(messages[i], "message");
      message.isNewMessage = false;
      this.chatList.drawMessage(message.serialize());
    }

    socket.registerOpenHandler(() => {
      this.chatFrom.init((data) => {
        let message = new ChatMessage({
          message: data,
          messageType: "message"
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
        this.chatList.drawMessage(message.serialize());
        messageStore.set(message);
      } else if (message.messageType == "roomList") {
        var rooms = JSON.parse(message.message);
        this.roomList.drawRoomList(rooms, currentRoom);
      }
    })

    this.chatFrom.registerNewRoomHandler(()=>{
      var room = prompt('Enter a room name');;
      currentRoom = room;
      this.roomList.drawRoom(currentRoom);
      var roomListMessage = new ChatMessage("");
      roomListMessage.messageType = "roomList";
      socket.sendMessage(roomListMessage.serialize())
    })

    this.roomList.registerRoomChangeHandler((newRoom)=>{
      this.chatList.clearChatList();
      currentRoom = newRoom;
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
    message: m,
    messageType: mt,
    user: u = username,
    room: r = currentRoom,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
    this.room = r,
      this.messageType = mt,
      this.isNewMessage = true;
  }

  serialize() {
    return {
      user: this.user,
      message: this.message,
      room: this.room,
      timestamp: this.timestamp,
      isNewMessage: this.isNewMessage,
      messageType: this.messageType
    }
  }
}

export {
  ChatApp
};

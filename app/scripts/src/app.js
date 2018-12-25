import {ret as socket}  from './ws-client';
import {UserStore} from './storage';
import {ChatForm, ChatList, promptForUsername} from './dom';
const FORM_SELECTOR = '[data-chat="chat-form"]';
const INPUT_SELECTOR = '[data-chat="message-input"]'
const LIST_SELECTOR = '[data-chat="message-list"]'

let userStore = new UserStore('x-chattrbox/u');
let username = userStore.get();

if(!username){
  username = promptForUsername();
  userStore.set(username)
}

class ChatApp {
  constructor() {
    socket.init('ws://localhost:3002');
    this.chatFrom = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR);
    this.chatList = new ChatList(LIST_SELECTOR, username);
    socket.registerOpenHandler(() => {
      this.chatFrom.init((data)=>{
        let message = new ChatMessage({message: data});
        socket.sendMessage(message.serialize());
      })

      })

    socket.registerMassageHandler(data => {
      let message = new ChatMessage(data);
      this.chatList.drawMessage(message.serialize());
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
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m;
    this.user = u;
    this.timestamp = t;
  }

  serialize() {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    }
  }
}

export {ChatApp};

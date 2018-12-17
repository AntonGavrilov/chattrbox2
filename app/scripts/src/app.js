import {ret as socket}  from './ws-client';

class ChatApp {
  constructor() {
    socket.init('ws://localhost:3002');
    socket.registerOpenHandler(() => {
      let message = new ChatMessage({
        message: 'pow!'
      });
      socket.sendMessage(message.serialize());
    })
    socket.registerMassageHandler(data => {
      console.log(data);
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
    user: u = 'batman',
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

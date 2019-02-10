class Store {
  constructor(storageApi) {
    this.api = storageApi;
  }

  get() {
    return this.api.getItem(this.key);
  }

  set(value) {
    this.api.setItem(this.key, value)
  }
}

export class UserStore extends Store {
  constructor(key) {
    super(sessionStorage);
    this.key = key;
  }
}

export class MessageStore extends Store {
  constructor(key) {
    super(sessionStorage);
    this.key = key;
  }

  get(room) {
    var jsonMessages = super.get(this.key);
    var messagearr = [];
    var messages;


    if(jsonMessages != null)  {
      messages = JSON.parse(jsonMessages);
      if (room in messages)
        messagearr = messages[room];
    }

    return messagearr;
  }

  set(message, room) {
    var messagearr = [];
    var jsonMessages = super.get(this.key);
    var messages;

    if (jsonMessages == null) {
      messages = {};
    } else {
      messages = JSON.parse(jsonMessages);
    }

    if (messages[room] != undefined)
      messagearr = messages[room];

    messagearr.push(message);
    messages[room] = messagearr;

    super.set(JSON.stringify(messages))
  }
}

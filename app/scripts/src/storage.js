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

  get() {
    var messagearr = [];

    if (super.get(this.key) != null)
      var messagearr = JSON.parse(super.get(this.key));

    return  messagearr;
  }

  set(value) {
    var messagearr = [];
    if (super.get(this.key) != null)
      var messagearr = JSON.parse(super.get(this.key));
    messagearr.push(value);
    super.set(JSON.stringify(messagearr))
  }
}

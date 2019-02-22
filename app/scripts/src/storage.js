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


export class LastSeenMsgDateStore extends Store {
  constructor(key) {
    super(sessionStorage);
    this.key = key;
  }

  get(room) {
    var jsonDates = super.get(this.key);
    var dates;
    var date = 0;

    if(jsonDates != null)  {
      dates = JSON.parse(jsonDates);
      if (room in dates)
        date = dates[room];
    }
    return date;
  }

  set(newDate, room) {
    var jsonDates = super.get(this.key);
    var dates;

    if (jsonDates == null) {
      dates = {};
    } else {
      dates = JSON.parse(jsonDates);
    }

    dates[room] = newDate;

    super.set(JSON.stringify(dates))
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

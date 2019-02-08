import $ from 'jquery';
import md5 from 'crypto-js/md5';
import moment from 'moment'

function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUsername() {
  let username = prompt('Ennter a username');
  return username.toLowerCase();
}

export class ChatForm {
  constructor(formSel, InputSel) {
    this.$form = $(formSel);
    this.$input = $(InputSel);
  }

  init(submitCallback) {
    this.$form.submit((event) => {
      event.preventDefault();
      let val = this.$input.val();
      submitCallback(val);
      this.$input.val('');
    });
    this.$form.find('btn btn-default').on('click', () => this.$form.submit())
  }

  registerNewRoomHandler(newRoomCallBack) {
    $('.btn.btn-newRoom').on('click', () => newRoomCallBack())
  }
}


export class RoomList {
  constructor(list) {
    this.$list = $(list);
  }

  registerRoomChangeHandler(roomChangeCallback){
    this.roomChangeCallback = roomChangeCallback;
  }


  drawRoomList(roomList, currentRoom) {
    var b = 1;

    $(".room-row").each(function(index) {
      $(this).remove();
    });

    roomList.forEach((room, i, arr) => {
      this.drawRoom(room, currentRoom);
    })
  }

  drawRoom(room, currentRoom) {
    let $messageRow = $('<li>', {
      'class': 'room-row',
      'text': room
    })

    if(currentRoom == room){
      $messageRow.addClass('currentRoom');
    }

    $messageRow.on('click', (event)=>{
      var curRoom = event.target.innerText;

      this.roomChangeCallback(curRoom);

      $('.currentRoom').removeClass("currentRoom");

      $(event.target).addClass('currentRoom');
    })
    this.$list.append($messageRow);
  }
}


export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
    this.timer = setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr('data-time'));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }

  init() {}

  clearChatList(){
    $(".message-row").each(function(index) {
      $(this).remove();
    });
  }

  drawMessage({
    user: u,
    timestamp: t,
    message: m,
    isNewMessage: isNewMessage
  }) {

    let $messageRow = $('<li>', {
      'class': 'message-row'
    })

    if (this.username == u) {
      $messageRow.addClass('me');
    }

    let $message = $('<p>');

    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    }));

    $message.append($('<span>', {
      'class': 'timestamp',
      'data-time': t,
      text: moment(t).fromNow()
    }))

    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    }))

    let $img = $('<img>', {
      src: createGravatarUrl(u),
      title: u
    })

    $messageRow.append($img);
    $messageRow.append($message);
    this.$list.append($messageRow);
    $messageRow.get(0).scrollIntoView();
    $messageRow.css('display', 'flex');

    if (isNewMessage) {
      $messageRow.addClass('is-new-message');
      setTimeout(function() {
        $messageRow.removeClass('is-new-message');
      }, 2000);
    }
    $messageRow.get(0).scrollIntoView();

  }
}

import $ from 'jquery';
import md5 from 'crypto-js/md5';
import moment from 'moment'

function createGravatarUrl(username) {
  let userhash = md5(username);
  return `http://www.gravatar.com/avatar/${userhash.toString()}`;
}

export function promptForUsername() {
  let username = prompt('Enter a username');
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
      if(val != '')
        submitCallback(val);
      this.$input.val('');
    });
    this.$form.find('btn btn-default').on('click', () => this.$form.submit())
  }

  registerNewRoomHandler(newRoomCallBack) {
    $('.btn.btn-newRoom').on('click', () => newRoomCallBack())
  }

  registerJoinRoomHandler(newRoomCallBack) {
    $('.btn.btn-joinRoom').on('click', () => newRoomCallBack())
  }
}


export class RoomList {
  constructor(list) {
    this.$list = $(list);

    this.timer = setInterval(() => {
        this.messageUpdateMsgCountCallback();
    }, 3000);
  }

  registerRoomChangeHandler(roomChangeCallback){
    this.roomChangeCallback = roomChangeCallback;
  }

  registerMessageUpdateMsgCountHandler(messageUpdateMsgCountCallback){
    this.messageUpdateMsgCountCallback = messageUpdateMsgCountCallback;
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

  addRoom(roomName, currentRoom){

  }

  updateNewMsgCount(roomListMsgCount){
    Object.keys(roomListMsgCount).forEach(r => {
      var msgCountBadge = this.$list.find('[roomid="' + r + '"]').children('.badge-pill');
      msgCountBadge[0].textContent = (roomListMsgCount[r] == 0) ? "" : roomListMsgCount[r] ;
    },this)
  }

  setCurrentRoom($currentRoom){

    $(".room-row").each(function(index) {
      $(this).removeClass('active');
    });

    $currentRoom.addClass('active');
  }

  drawRoom(room, currentRoom) {
    let $messageRow = $('<li>', {
      'class': 'list-group-item d-flex room-row',
      'roomId': room,
      'text': room
    })

    this.setCurrentRoom($messageRow);

    let $msgCountBadge = $('<span>', {
      'class': 'badge badge-primary badge-pill',
      'text': ""
    })

    $messageRow.append($msgCountBadge)

    $messageRow.on('click', (event) => {
      var curRoom = $(event.target).attr('roomid');
      this.roomChangeCallback(curRoom);
      $('.room-row.active').removeClass("active");
      $(event.target).addClass('active');
    })
    this.$list.append($messageRow);
  }
}


export class ChatList {
  constructor(listSel, username) {
    this.$list = $(listSel);
    this.username = username;
    this.$loadingRing = this.createLoadingRing();
    this.timer = setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element);
        let timestamp = new Date().setTime($element.attr('data-time'));
        let ago = moment(timestamp).fromNow();
        $element.html(ago);
      });
    }, 1000);
  }

  createLoadingRing(){
    let ring = $('<div>',{
      'class' : "lds-ring"
    });

    for (var i = 0; i < 4; i++) {
      let div = $('<div>');
      ring.append(div);
    }
    return ring;
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

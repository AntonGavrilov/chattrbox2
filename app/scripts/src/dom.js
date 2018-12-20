import $ from 'jquery'

export class ChatForm{
  constructor(formSel, InputSel){
    this.$form = $(formSel);
    this.$input = $(InputSel);
  }

  init(submitCallback){
    this.$form.submit((event) => {
      event.preventDefault();
      let val = this.$input.val();
      submitCallback(val);
      this.$input.val('');
    });
    this.$form.find('button').on('click', () => this.$form.submit())
  }
}

export class ChatList{
  constructor(listSel, username){
    this.$list = $(listSel);
    this.username = username;
  }

    drawMessage({user: u, timestamp: t, message: m}){
      let $messageRow = $('<li>', {
        'class': 'message-username',
        text: u})

      if(this.username == u){
        $messageRow.addClass('me');
      }

      let $message = $('<p>');

      $message.append($('<span>', {
        'class': 'timestamp',
        'data-time': t,
        text: (new Date(t)).getTime()
      }))

      $message.append($('<span>', {
        'class': 'message-message',
        text: m
      }));

      $messageRow.append($message);
      this.$list.append($messageRow);
      $messageRow.get(0).scrollIntoView();


  }
}

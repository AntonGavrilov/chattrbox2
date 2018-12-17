import {ChatApp} from './app';
let chat = new ChatApp();
let button;

var elements = document.getElementsByClassName("btn btn-close");

for (var i = 0; i < elements.length; i++) {
  button = elements[i];
  button.onclick = CloseConnection;
}

function CloseConnection() {

  var isAlive = chat.isAlive();

  for (var i = 0; i < 3; i++) {

    if (isAlive) {
      var result = window.confirm("You need to close ws connection");
      isAlive = chat.isAlive();
    }
    else
    {
      button.innerHTML = "connection is closed";
    }
  }
}

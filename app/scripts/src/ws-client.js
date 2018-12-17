let socket;

function init(url){
  socket = new WebSocket(url);
  console.log('connecting...');
}


function registerOpenHandler(handlerFunction){
  socket.onopen = ()=>{
    console.log('open');
    handlerFunction();
  };
}

function registerMassageHandler(handlerFunction){
  socket.onmessage = (e)=>{
    console.log('message', e.data);
    let data = JSON.parse(e.data);
    handlerFunction(data);
  };
}

function registerCloserHandler(handlerfunction){
  socket.onclose = (e)=>{
    console.log('close');
    handlerfunction(e);
  };
}

function close(){
  socket.close();
}

function sendMessage(payload){
  socket.send(JSON.stringify(payload));
}

function getState(){
  console.log("state " + socket.readyState)
  return socket.readyState;
}

var ret = {
  getState,
  init,
  registerOpenHandler,
  registerMassageHandler,
  sendMessage,
  registerCloserHandler,
  close
}

export  { ret }

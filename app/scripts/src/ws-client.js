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

function sendMessage(payload){
  socket.send(JSON.stringify(payload));
}

export default{
  init,
  registerOpenHandler,
  registerMassageHandler,
  sendMessage
}

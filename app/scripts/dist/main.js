(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChatApp = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wsClient = require('./ws-client');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatApp = function () {
  function ChatApp() {
    _classCallCheck(this, ChatApp);

    _wsClient.ret.init('ws://localhost:3002');
    _wsClient.ret.registerOpenHandler(function () {
      var message = new ChatMessage({
        message: 'pow!'
      });
      _wsClient.ret.sendMessage(message.serialize());
    });
    _wsClient.ret.registerMassageHandler(function (data) {
      console.log(data);
    });

    _wsClient.ret.registerCloserHandler(function (e) {
      console.log(_wsClient.ret.readyState);
    });
  }

  _createClass(ChatApp, [{
    key: 'isAlive',
    value: function isAlive() {
      if (_wsClient.ret.getState() == 1) {
        console.log("ret true");
        return true;
      }
      console.log("ret false");
      return false;
    }
  }]);

  return ChatApp;
}();

var ChatMessage = function () {
  function ChatMessage(_ref) {
    var m = _ref.message,
        _ref$user = _ref.user,
        u = _ref$user === undefined ? 'batman' : _ref$user,
        _ref$timestamp = _ref.timestamp,
        t = _ref$timestamp === undefined ? new Date().getTime() : _ref$timestamp;

    _classCallCheck(this, ChatMessage);

    this.message = m;
    this.user = u;
    this.timestamp = t;
  }

  _createClass(ChatMessage, [{
    key: 'serialize',
    value: function serialize() {
      return {
        user: this.user,
        message: this.message,
        timestamp: this.timestamp
      };
    }
  }]);

  return ChatMessage;
}();

exports.ChatApp = ChatApp;

},{"./ws-client":3}],2:[function(require,module,exports){
"use strict";

var _app = require("./app");

var chat = new _app.ChatApp();
var button = void 0;

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
    } else {
      button.innerHTML = "connection is closed";
    }
  }
}

},{"./app":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var socket = void 0;

function init(url) {
  socket = new WebSocket(url);
  console.log('connecting...');
}

function registerOpenHandler(handlerFunction) {
  socket.onopen = function () {
    console.log('open');
    handlerFunction();
  };
}

function registerMassageHandler(handlerFunction) {
  socket.onmessage = function (e) {
    console.log('message', e.data);
    var data = JSON.parse(e.data);
    handlerFunction(data);
  };
}

function registerCloserHandler(handlerfunction) {
  socket.onclose = function (e) {
    console.log('close');
    handlerfunction(e);
  };
}

function close() {
  socket.close();
}

function sendMessage(payload) {
  socket.send(JSON.stringify(payload));
}

function getState() {
  console.log("state " + socket.readyState);
  return socket.readyState;
}

var ret = {
  getState: getState,
  init: init,
  registerOpenHandler: registerOpenHandler,
  registerMassageHandler: registerMassageHandler,
  sendMessage: sendMessage,
  registerCloserHandler: registerCloserHandler,
  close: close
};

exports.ret = ret;

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9zcmMvYXBwLmpzIiwiYXBwL3NjcmlwdHMvc3JjL21haW4uanMiLCJhcHAvc2NyaXB0cy9zcmMvd3MtY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7O0FDQUE7Ozs7SUFFTSxPO0FBQ0oscUJBQWM7QUFBQTs7QUFDWixrQkFBTyxJQUFQLENBQVkscUJBQVo7QUFDQSxrQkFBTyxtQkFBUCxDQUEyQixZQUFNO0FBQy9CLFVBQUksVUFBVSxJQUFJLFdBQUosQ0FBZ0I7QUFDNUIsaUJBQVM7QUFEbUIsT0FBaEIsQ0FBZDtBQUdBLG9CQUFPLFdBQVAsQ0FBbUIsUUFBUSxTQUFSLEVBQW5CO0FBQ0QsS0FMRDtBQU1BLGtCQUFPLHNCQUFQLENBQThCLGdCQUFRO0FBQ3BDLGNBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxLQUZEOztBQUlBLGtCQUFPLHFCQUFQLENBQTZCLGFBQUs7QUFDaEMsY0FBUSxHQUFSLENBQVksY0FBTyxVQUFuQjtBQUNELEtBRkQ7QUFHRDs7Ozs4QkFDUztBQUNSLFVBQUksY0FBTyxRQUFQLE1BQXFCLENBQXpCLEVBQTRCO0FBQzFCLGdCQUFRLEdBQVIsQ0FBWSxVQUFaO0FBQ0EsZUFBTyxJQUFQO0FBQ0Q7QUFDRCxjQUFRLEdBQVIsQ0FBWSxXQUFaO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7Ozs7OztJQUdHLFc7QUFDSiw2QkFJRztBQUFBLFFBSFEsQ0FHUixRQUhELE9BR0M7QUFBQSx5QkFGRCxJQUVDO0FBQUEsUUFGSyxDQUVMLDZCQUZTLFFBRVQ7QUFBQSw4QkFERCxTQUNDO0FBQUEsUUFEVSxDQUNWLGtDQURlLElBQUksSUFBSixFQUFELENBQWEsT0FBYixFQUNkOztBQUFBOztBQUNELFNBQUssT0FBTCxHQUFlLENBQWY7QUFDQSxTQUFLLElBQUwsR0FBWSxDQUFaO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLENBQWpCO0FBQ0Q7Ozs7Z0NBRVc7QUFDVixhQUFPO0FBQ0wsY0FBTSxLQUFLLElBRE47QUFFTCxpQkFBUyxLQUFLLE9BRlQ7QUFHTCxtQkFBVyxLQUFLO0FBSFgsT0FBUDtBQUtEOzs7Ozs7UUFHSyxPLEdBQUEsTzs7Ozs7QUNqRFI7O0FBQ0EsSUFBSSxPQUFPLElBQUksWUFBSixFQUFYO0FBQ0EsSUFBSSxlQUFKOztBQUVBLElBQUksV0FBVyxTQUFTLHNCQUFULENBQWdDLGVBQWhDLENBQWY7O0FBRUEsS0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsTUFBN0IsRUFBcUMsR0FBckMsRUFBMEM7QUFDeEMsV0FBUyxTQUFTLENBQVQsQ0FBVDtBQUNBLFNBQU8sT0FBUCxHQUFpQixlQUFqQjtBQUNEOztBQUVELFNBQVMsZUFBVCxHQUEyQjs7QUFFekIsTUFBSSxVQUFVLEtBQUssT0FBTCxFQUFkOztBQUVBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxDQUFwQixFQUF1QixHQUF2QixFQUE0Qjs7QUFFMUIsUUFBSSxPQUFKLEVBQWE7QUFDWCxVQUFJLFNBQVMsT0FBTyxPQUFQLENBQWUsaUNBQWYsQ0FBYjtBQUNBLGdCQUFVLEtBQUssT0FBTCxFQUFWO0FBQ0QsS0FIRCxNQUtBO0FBQ0UsYUFBTyxTQUFQLEdBQW1CLHNCQUFuQjtBQUNEO0FBRUY7QUFHRjs7Ozs7Ozs7QUM3QkQsSUFBSSxlQUFKOztBQUVBLFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBa0I7QUFDaEIsV0FBUyxJQUFJLFNBQUosQ0FBYyxHQUFkLENBQVQ7QUFDQSxVQUFRLEdBQVIsQ0FBWSxlQUFaO0FBQ0Q7O0FBR0QsU0FBUyxtQkFBVCxDQUE2QixlQUE3QixFQUE2QztBQUMzQyxTQUFPLE1BQVAsR0FBZ0IsWUFBSTtBQUNsQixZQUFRLEdBQVIsQ0FBWSxNQUFaO0FBQ0E7QUFDRCxHQUhEO0FBSUQ7O0FBRUQsU0FBUyxzQkFBVCxDQUFnQyxlQUFoQyxFQUFnRDtBQUM5QyxTQUFPLFNBQVAsR0FBbUIsVUFBQyxDQUFELEVBQUs7QUFDdEIsWUFBUSxHQUFSLENBQVksU0FBWixFQUF1QixFQUFFLElBQXpCO0FBQ0EsUUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLEVBQUUsSUFBYixDQUFYO0FBQ0Esb0JBQWdCLElBQWhCO0FBQ0QsR0FKRDtBQUtEOztBQUVELFNBQVMscUJBQVQsQ0FBK0IsZUFBL0IsRUFBK0M7QUFDN0MsU0FBTyxPQUFQLEdBQWlCLFVBQUMsQ0FBRCxFQUFLO0FBQ3BCLFlBQVEsR0FBUixDQUFZLE9BQVo7QUFDQSxvQkFBZ0IsQ0FBaEI7QUFDRCxHQUhEO0FBSUQ7O0FBRUQsU0FBUyxLQUFULEdBQWdCO0FBQ2QsU0FBTyxLQUFQO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULENBQXFCLE9BQXJCLEVBQTZCO0FBQzNCLFNBQU8sSUFBUCxDQUFZLEtBQUssU0FBTCxDQUFlLE9BQWYsQ0FBWjtBQUNEOztBQUVELFNBQVMsUUFBVCxHQUFtQjtBQUNqQixVQUFRLEdBQVIsQ0FBWSxXQUFXLE9BQU8sVUFBOUI7QUFDQSxTQUFPLE9BQU8sVUFBZDtBQUNEOztBQUVELElBQUksTUFBTTtBQUNSLG9CQURRO0FBRVIsWUFGUTtBQUdSLDBDQUhRO0FBSVIsZ0RBSlE7QUFLUiwwQkFMUTtBQU1SLDhDQU5RO0FBT1I7QUFQUSxDQUFWOztRQVVVLEcsR0FBQSxHIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiaW1wb3J0IHtyZXQgYXMgc29ja2V0fSAgZnJvbSAnLi93cy1jbGllbnQnO1xyXG5cclxuY2xhc3MgQ2hhdEFwcCB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBzb2NrZXQuaW5pdCgnd3M6Ly9sb2NhbGhvc3Q6MzAwMicpO1xyXG4gICAgc29ja2V0LnJlZ2lzdGVyT3BlbkhhbmRsZXIoKCkgPT4ge1xyXG4gICAgICBsZXQgbWVzc2FnZSA9IG5ldyBDaGF0TWVzc2FnZSh7XHJcbiAgICAgICAgbWVzc2FnZTogJ3BvdyEnXHJcbiAgICAgIH0pO1xyXG4gICAgICBzb2NrZXQuc2VuZE1lc3NhZ2UobWVzc2FnZS5zZXJpYWxpemUoKSk7XHJcbiAgICB9KVxyXG4gICAgc29ja2V0LnJlZ2lzdGVyTWFzc2FnZUhhbmRsZXIoZGF0YSA9PiB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xyXG4gICAgfSlcclxuXHJcbiAgICBzb2NrZXQucmVnaXN0ZXJDbG9zZXJIYW5kbGVyKGUgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhzb2NrZXQucmVhZHlTdGF0ZSk7XHJcbiAgICB9KVxyXG4gIH1cclxuICBpc0FsaXZlKCkge1xyXG4gICAgaWYgKHNvY2tldC5nZXRTdGF0ZSgpID09IDEpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJyZXQgdHJ1ZVwiKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcbiAgICBjb25zb2xlLmxvZyhcInJldCBmYWxzZVwiKTtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIENoYXRNZXNzYWdlIHtcclxuICBjb25zdHJ1Y3Rvcih7XHJcbiAgICBtZXNzYWdlOiBtLFxyXG4gICAgdXNlcjogdSA9ICdiYXRtYW4nLFxyXG4gICAgdGltZXN0YW1wOiB0ID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKVxyXG4gIH0pIHtcclxuICAgIHRoaXMubWVzc2FnZSA9IG07XHJcbiAgICB0aGlzLnVzZXIgPSB1O1xyXG4gICAgdGhpcy50aW1lc3RhbXAgPSB0O1xyXG4gIH1cclxuXHJcbiAgc2VyaWFsaXplKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXNlcjogdGhpcy51c2VyLFxyXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXBcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCB7Q2hhdEFwcH07XHJcbiIsImltcG9ydCB7Q2hhdEFwcH0gZnJvbSAnLi9hcHAnO1xyXG5sZXQgY2hhdCA9IG5ldyBDaGF0QXBwKCk7XHJcbmxldCBidXR0b247XHJcblxyXG52YXIgZWxlbWVudHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKFwiYnRuIGJ0bi1jbG9zZVwiKTtcclxuXHJcbmZvciAodmFyIGkgPSAwOyBpIDwgZWxlbWVudHMubGVuZ3RoOyBpKyspIHtcclxuICBidXR0b24gPSBlbGVtZW50c1tpXTtcclxuICBidXR0b24ub25jbGljayA9IENsb3NlQ29ubmVjdGlvbjtcclxufVxyXG5cclxuZnVuY3Rpb24gQ2xvc2VDb25uZWN0aW9uKCkge1xyXG5cclxuICB2YXIgaXNBbGl2ZSA9IGNoYXQuaXNBbGl2ZSgpO1xyXG5cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xyXG5cclxuICAgIGlmIChpc0FsaXZlKSB7XHJcbiAgICAgIHZhciByZXN1bHQgPSB3aW5kb3cuY29uZmlybShcIllvdSBuZWVkIHRvIGNsb3NlIHdzIGNvbm5lY3Rpb25cIik7XHJcbiAgICAgIGlzQWxpdmUgPSBjaGF0LmlzQWxpdmUoKTtcclxuICAgIH1cclxuICAgIGVsc2VcclxuICAgIHtcclxuICAgICAgYnV0dG9uLmlubmVySFRNTCA9IFwiY29ubmVjdGlvbiBpcyBjbG9zZWRcIjtcclxuICAgIH1cclxuXHJcbiAgfVxyXG5cclxuXHJcbn1cclxuIiwibGV0IHNvY2tldDtcclxuXHJcbmZ1bmN0aW9uIGluaXQodXJsKXtcclxuICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgY29uc29sZS5sb2coJ2Nvbm5lY3RpbmcuLi4nKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyT3BlbkhhbmRsZXIoaGFuZGxlckZ1bmN0aW9uKXtcclxuICBzb2NrZXQub25vcGVuID0gKCk9PntcclxuICAgIGNvbnNvbGUubG9nKCdvcGVuJyk7XHJcbiAgICBoYW5kbGVyRnVuY3Rpb24oKTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3Rlck1hc3NhZ2VIYW5kbGVyKGhhbmRsZXJGdW5jdGlvbil7XHJcbiAgc29ja2V0Lm9ubWVzc2FnZSA9IChlKT0+e1xyXG4gICAgY29uc29sZS5sb2coJ21lc3NhZ2UnLCBlLmRhdGEpO1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICBoYW5kbGVyRnVuY3Rpb24oZGF0YSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVnaXN0ZXJDbG9zZXJIYW5kbGVyKGhhbmRsZXJmdW5jdGlvbil7XHJcbiAgc29ja2V0Lm9uY2xvc2UgPSAoZSk9PntcclxuICAgIGNvbnNvbGUubG9nKCdjbG9zZScpO1xyXG4gICAgaGFuZGxlcmZ1bmN0aW9uKGUpO1xyXG4gIH07XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNsb3NlKCl7XHJcbiAgc29ja2V0LmNsb3NlKCk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNlbmRNZXNzYWdlKHBheWxvYWQpe1xyXG4gIHNvY2tldC5zZW5kKEpTT04uc3RyaW5naWZ5KHBheWxvYWQpKTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U3RhdGUoKXtcclxuICBjb25zb2xlLmxvZyhcInN0YXRlIFwiICsgc29ja2V0LnJlYWR5U3RhdGUpXHJcbiAgcmV0dXJuIHNvY2tldC5yZWFkeVN0YXRlO1xyXG59XHJcblxyXG52YXIgcmV0ID0ge1xyXG4gIGdldFN0YXRlLFxyXG4gIGluaXQsXHJcbiAgcmVnaXN0ZXJPcGVuSGFuZGxlcixcclxuICByZWdpc3Rlck1hc3NhZ2VIYW5kbGVyLFxyXG4gIHNlbmRNZXNzYWdlLFxyXG4gIHJlZ2lzdGVyQ2xvc2VySGFuZGxlcixcclxuICBjbG9zZVxyXG59XHJcblxyXG5leHBvcnQgIHsgcmV0IH1cclxuIl19

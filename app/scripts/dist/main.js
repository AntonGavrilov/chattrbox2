(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _wsClient = require('./ws-client');

var _wsClient2 = _interopRequireDefault(_wsClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ChatApp = function ChatApp() {
  _classCallCheck(this, ChatApp);

  _wsClient2.default.init('ws://localhost:3002');
  _wsClient2.default.registerOpenHandler(function () {
    var message = new ChatMessage({ message: 'pow!' });
    _wsClient2.default.sendMessage(message.serialize());
  });
  _wsClient2.default.registerMassageHandler(function (data) {
    console.log(data);
  });
};

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

exports.default = ChatApp;

},{"./ws-client":3}],2:[function(require,module,exports){
'use strict';

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

new _app2.default();

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

function sendMessage(payload) {
  socket.send(JSON.stringify(payload));
}

exports.default = {
  init: init,
  registerOpenHandler: registerOpenHandler,
  registerMassageHandler: registerMassageHandler,
  sendMessage: sendMessage
};

},{}]},{},[2])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvc2NyaXB0cy9zcmMvYXBwLmpzIiwiYXBwL3NjcmlwdHMvc3JjL21haW4uanMiLCJhcHAvc2NyaXB0cy9zcmMvd3MtY2xpZW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7QUNBQTs7Ozs7Ozs7SUFFTSxPLEdBQ0osbUJBQWE7QUFBQTs7QUFDWCxxQkFBTyxJQUFQLENBQVkscUJBQVo7QUFDQSxxQkFBTyxtQkFBUCxDQUEyQixZQUFJO0FBQzdCLFFBQUksVUFBVSxJQUFJLFdBQUosQ0FBZ0IsRUFBQyxTQUFTLE1BQVYsRUFBaEIsQ0FBZDtBQUNBLHVCQUFPLFdBQVAsQ0FBbUIsUUFBUSxTQUFSLEVBQW5CO0FBQ0QsR0FIRDtBQUlBLHFCQUFPLHNCQUFQLENBQStCLGdCQUFNO0FBQ25DLFlBQVEsR0FBUixDQUFZLElBQVo7QUFDRCxHQUZEO0FBSUQsQzs7SUFHRyxXO0FBQ0osNkJBSUU7QUFBQSxRQUhTLENBR1QsUUFIQSxPQUdBO0FBQUEseUJBRkEsSUFFQTtBQUFBLFFBRk0sQ0FFTiw2QkFGVSxRQUVWO0FBQUEsOEJBREEsU0FDQTtBQUFBLFFBRFcsQ0FDWCxrQ0FEZ0IsSUFBSSxJQUFKLEVBQUQsQ0FBYSxPQUFiLEVBQ2Y7O0FBQUE7O0FBQ0EsU0FBSyxPQUFMLEdBQWUsQ0FBZjtBQUNBLFNBQUssSUFBTCxHQUFZLENBQVo7QUFDQSxTQUFLLFNBQUwsR0FBaUIsQ0FBakI7QUFDRDs7OztnQ0FFVTtBQUNULGFBQU87QUFDTCxjQUFNLEtBQUssSUFETjtBQUVMLGlCQUFTLEtBQUssT0FGVDtBQUdMLG1CQUFXLEtBQUs7QUFIWCxPQUFQO0FBS0Q7Ozs7OztrQkFHWSxPOzs7OztBQ3BDZjs7Ozs7O0FBQ0EsSUFBSSxhQUFKOzs7Ozs7OztBQ0RBLElBQUksZUFBSjs7QUFFQSxTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQWtCO0FBQ2hCLFdBQVMsSUFBSSxTQUFKLENBQWMsR0FBZCxDQUFUO0FBQ0EsVUFBUSxHQUFSLENBQVksZUFBWjtBQUNEOztBQUdELFNBQVMsbUJBQVQsQ0FBNkIsZUFBN0IsRUFBNkM7QUFDM0MsU0FBTyxNQUFQLEdBQWdCLFlBQUk7QUFDbEIsWUFBUSxHQUFSLENBQVksTUFBWjtBQUNBO0FBQ0QsR0FIRDtBQUlEOztBQUVELFNBQVMsc0JBQVQsQ0FBZ0MsZUFBaEMsRUFBZ0Q7QUFDOUMsU0FBTyxTQUFQLEdBQW1CLFVBQUMsQ0FBRCxFQUFLO0FBQ3RCLFlBQVEsR0FBUixDQUFZLFNBQVosRUFBdUIsRUFBRSxJQUF6QjtBQUNBLFFBQUksT0FBTyxLQUFLLEtBQUwsQ0FBVyxFQUFFLElBQWIsQ0FBWDtBQUNBLG9CQUFnQixJQUFoQjtBQUNELEdBSkQ7QUFLRDs7QUFFRCxTQUFTLFdBQVQsQ0FBcUIsT0FBckIsRUFBNkI7QUFDM0IsU0FBTyxJQUFQLENBQVksS0FBSyxTQUFMLENBQWUsT0FBZixDQUFaO0FBQ0Q7O2tCQUVhO0FBQ1osWUFEWTtBQUVaLDBDQUZZO0FBR1osZ0RBSFk7QUFJWjtBQUpZLEMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJpbXBvcnQgc29ja2V0IGZyb20gJy4vd3MtY2xpZW50JztcclxuXHJcbmNsYXNzIENoYXRBcHB7XHJcbiAgY29uc3RydWN0b3IoKXtcclxuICAgIHNvY2tldC5pbml0KCd3czovL2xvY2FsaG9zdDozMDAyJyk7XHJcbiAgICBzb2NrZXQucmVnaXN0ZXJPcGVuSGFuZGxlcigoKT0+e1xyXG4gICAgICBsZXQgbWVzc2FnZSA9IG5ldyBDaGF0TWVzc2FnZSh7bWVzc2FnZTogJ3BvdyEnfSk7XHJcbiAgICAgIHNvY2tldC5zZW5kTWVzc2FnZShtZXNzYWdlLnNlcmlhbGl6ZSgpKTtcclxuICAgIH0pXHJcbiAgICBzb2NrZXQucmVnaXN0ZXJNYXNzYWdlSGFuZGxlcigoZGF0YT0+e1xyXG4gICAgICBjb25zb2xlLmxvZyhkYXRhKTtcclxuICAgIH0pKVxyXG5cclxuICB9XHJcbn1cclxuXHJcbmNsYXNzIENoYXRNZXNzYWdle1xyXG4gIGNvbnN0cnVjdG9yKHtcclxuICAgIG1lc3NhZ2U6IG0sXHJcbiAgICB1c2VyOiB1ID0gJ2JhdG1hbicsXHJcbiAgICB0aW1lc3RhbXA6IHQgPSAobmV3IERhdGUoKSkuZ2V0VGltZSgpXHJcbiAgfSl7XHJcbiAgICB0aGlzLm1lc3NhZ2UgPSBtO1xyXG4gICAgdGhpcy51c2VyID0gdTtcclxuICAgIHRoaXMudGltZXN0YW1wID0gdDtcclxuICB9XHJcblxyXG4gIHNlcmlhbGl6ZSgpe1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdXNlcjogdGhpcy51c2VyLFxyXG4gICAgICBtZXNzYWdlOiB0aGlzLm1lc3NhZ2UsXHJcbiAgICAgIHRpbWVzdGFtcDogdGhpcy50aW1lc3RhbXBcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IENoYXRBcHA7XHJcbiIsImltcG9ydCBDaGF0QXBwIGZyb20gJy4vYXBwJztcclxubmV3IENoYXRBcHAoKTtcclxuIiwibGV0IHNvY2tldDtcclxuXHJcbmZ1bmN0aW9uIGluaXQodXJsKXtcclxuICBzb2NrZXQgPSBuZXcgV2ViU29ja2V0KHVybCk7XHJcbiAgY29uc29sZS5sb2coJ2Nvbm5lY3RpbmcuLi4nKTtcclxufVxyXG5cclxuXHJcbmZ1bmN0aW9uIHJlZ2lzdGVyT3BlbkhhbmRsZXIoaGFuZGxlckZ1bmN0aW9uKXtcclxuICBzb2NrZXQub25vcGVuID0gKCk9PntcclxuICAgIGNvbnNvbGUubG9nKCdvcGVuJyk7XHJcbiAgICBoYW5kbGVyRnVuY3Rpb24oKTtcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiByZWdpc3Rlck1hc3NhZ2VIYW5kbGVyKGhhbmRsZXJGdW5jdGlvbil7XHJcbiAgc29ja2V0Lm9ubWVzc2FnZSA9IChlKT0+e1xyXG4gICAgY29uc29sZS5sb2coJ21lc3NhZ2UnLCBlLmRhdGEpO1xyXG4gICAgbGV0IGRhdGEgPSBKU09OLnBhcnNlKGUuZGF0YSk7XHJcbiAgICBoYW5kbGVyRnVuY3Rpb24oZGF0YSk7XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2VuZE1lc3NhZ2UocGF5bG9hZCl7XHJcbiAgc29ja2V0LnNlbmQoSlNPTi5zdHJpbmdpZnkocGF5bG9hZCkpO1xyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdHtcclxuICBpbml0LFxyXG4gIHJlZ2lzdGVyT3BlbkhhbmRsZXIsXHJcbiAgcmVnaXN0ZXJNYXNzYWdlSGFuZGxlcixcclxuICBzZW5kTWVzc2FnZVxyXG59XHJcbiJdfQ==

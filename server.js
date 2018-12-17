var http = require('http');
var fs = require('fs');
var extract = require('./extract');
const mime = require('mime/lite');
var FileStore = require('./fileStore');

var Server = function(_port) {
  this.port = _port;
  this.Start = async function(func, staticFolder) {

    var server = http.createServer(async function(req, res) {

      var fileStore = new FileStore();
      fileStore.staticFolder = staticFolder;

      try {
        res.end(await fileStore.FromURL(req.url));
        func(res);

      } catch (e) {

        console.log("something wrong");

      } finally {

      }
    })

    server.listen(this.port);
      console.log("The server "+ this.port+" is runing...");
  }
}

module.exports = Server;

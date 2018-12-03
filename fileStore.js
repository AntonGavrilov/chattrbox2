var fs = require('fs');
var extract = require('./extract');
const mime = require('mime/lite');



var FileStore = function(){
  this.staticFolder = "";
}

  FileStore.prototype.FromURL = async function(URLName){

    return promise = new Promise((resolve, reject) => {
      filePath = extract(this.staticFolder, URLName);
      fs.readFile(filePath, function(err, data){
        if(err){
          var filePathErr = extract(this.staticFolder, "/404.html");
          fs.readFile(filePathErr, function(err, data){
            resolve(data);
          });
        }else{
          resolve(data);
        }
      }.bind(this));
    }
  )
}

module.exports = FileStore;

var path = require('path');

var extractFilePath = function(staticFolder, url){
  var filePath;
  var fileName = 'index.html';
  
  if(url.length > 1){
    fileName = url.substring(1);
  }
  filePath = path.resolve(__dirname, staticFolder, fileName);
  return filePath;
};

module.exports = extractFilePath;

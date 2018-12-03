
var fileStore = require('./fileStore');
 fileSt = new fileStore();
 fileSt.staicFolder = "app";
 console.log(fileSt.staicFolder);
 var func = function(data){
   console.log(data);
 }
 console.log(fileSt.FromFile("/404.html", func));

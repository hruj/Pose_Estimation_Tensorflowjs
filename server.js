var PORT=process.env.PORT||5000;
var express = require('express');
var fs = require('fs');
var app = express();

var http = require('http');
var server = http.Server(app);

app.use(express.static('client'));
server.listen(PORT, function(){
    console.log('Service Running!');
});
fs.readFile('./index.html', function (err, html) {

    if (err) throw err;    

    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(PORT);
});
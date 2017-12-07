var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res){
	res.sendFile('views/index.html')
});

http.listen(3000, function(){
	console.log('listening on localhost:3000');
});

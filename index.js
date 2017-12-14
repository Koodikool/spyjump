var express = require('express');
var app = express()
var http = require('http').Server(app);

app.use(express.static(__dirname))

app.get('/', function(req, res){
	res.sendFile('views/index.html', {root: __dirname })
});

app.get('/lobby', function(req, res){
	res.sendFile('views/lobby.html', {root: __dirname })
})

http.listen(3000, function(){
	console.log('listening on *:3000');
});
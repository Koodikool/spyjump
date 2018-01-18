var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var game = require('./game.js')

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Static HTML files
app.use(express.static(path.join(__dirname, 'public')));

var totalConnections = 0

// Sockets connect
io.on('connection', function (socket) {
	console.log("New user")
	totalConnections++

	setTimeout(function(){
		socket.broadcast.emit('usercount', totalConnections)
	}, 100)

	gameStart(socket)
});

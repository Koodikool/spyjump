var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log('Server listening at port %d', port);
});

// Static HTML files
app.use(express.static(path.join(__dirname, 'public')));

var totalConnections = 0

// Sockets connect
io.on('connection', function (socket) {
	console.log("New user")

	// New user connected
	totalConnections++
	socket.broadcast.emit('users', {
		total: totalConnections
	})

	// Join game
	socket.on('register', function(data){
		console.log(`User ${data.username} joined game ${data.gameid}`)
	})

	// User disconnected
	socket.on('disconnect', function () {
		totalConnections--
		socket.broadcast.emit('users', {
			total: totalConnections
		})
	});
});
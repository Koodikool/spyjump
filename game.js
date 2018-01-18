console.log("game.js")

var database = {}
var gameStructure = {
	players: {},
	details: {}
}
var userStructure = {
	name: '',
	role: '',
	admin: false
}

gameStart = function(socket) {
	username = null
	gameid = null

	// User tells server their username and gameid
	socket.on('register', function(data){
		console.log("Register:", data)

		// Does gameid exist
		if (database[data.gameid] === undefined) {
			database[data.gameid] = gameStructure
		}

		// Does username exist
		if (database[data.gameid].players[data.username] !== undefined) {
			socket.emit('errorr', 'User already exists')
			return
		} else {
			database[data.gameid].players[data.username] = userStructure
			socket.emit('msg', 'User registered')
		}

		username = data.username
		gameid = data.gameid
		console.log("Database:", database)

		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
	})

	socket.on('disconnect', function() {
		console.log("User disconnected")
		// totalConnections--
		// socket.broadcast.emit('usercount', totalConnections)
		console.log("User left game:", database[gameid])
		if (!database[gameid]) {
			return
		}

		delete database[gameid].players[username]
		socket.broadcast.emit('roomPlayerList', database)
		if (Object.keys(database[gameid].players).length === 0) {
			delete database[gameid]
		}
	})
}

playerListUpdate = function() {

}
console.log('game.js')

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
	
	//User tells server his name and gameid
	socket.on('register', function (data){
		console.log("Register:", data)
		
		//Does gameid exist
		if (database[data.gameid] === undefined) {
			database[data.gameid] = gameStructure
		}
		
		//Does username exist
		if (database[data.gameid][data.username] !== undefined){
			socket.emit('errorb', 'User already exists!')
			return
		} else {
			database[data.gameid].players[data.username] = userStructure
			socket.emit('msg', "User registered.")
		}
		
		username = data.username
		gameid = data.gameid
		console.log("Database: ", database)
		
		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
	})
	
	//User telling it is disconnecting
	socket.on('disconnect', function(){
		console.log("User disconnected")
		// totalConnections--
		// socket.broadcast.emit('usercount', totalConnections)
		if (!database[gameid]) {
			return
		}
		
		delete database[gameid].players[username]
		socket.broadcast.emit('roomPlayerList', database)
	})
}

playerListUpdate = function() {
	
}
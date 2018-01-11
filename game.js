console.log('game.js')

var database = {}
var gameStructure = {
	players: {}
	details: {}
}
var userStructure = {
	name: '',
	role: '',
	admin: false
}

gameStart = function(socket) {
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
	})
}
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

var placesDB = {
	Koodikool: ['Häkker', 'Tainaaju', 'Külaline', 'Rassist', 'Koer', 'Õps'],
	Kommipood: ['Mustas mantlis onu', 'Pervo', 'Väike laps', 'Välismaalane', 'Kassiir', 'Klient', 'Turvamees']
}

gameStart = function(socket) {

	// User tells server their username and gameid
	socket.on('register', function(data){
		console.log("Register:", data)
		console.log("User's socket ID:", socket.id, data.username)
		var gameid = data.gameid.toLowerCase()
		var isCreator = false

		// Does gameid exist
		if (database[gameid] === undefined) {
			database[gameid] = gameStructure
			isCreator = true
		} 

		if (!database[gameid].players)
			database[gameid].players = {}
		database[gameid].players[socket.id] = Object.assign({}, userStructure)
		database[gameid].players[socket.id].name = data.username
		if (isCreator)
			database[gameid].players[socket.id].admin = isCreator

		socket.gameid = gameid
		console.log("Database:", database)

		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
	})

	socket.on('disconnect', function() {
		console.log("User disconnected", socket.id)
		if (!database[socket.gameid]) {
			return
		}

		delete database[socket.gameid].players[socket.id]
		database = JSON.parse(JSON.stringify(database))
		console.log("AFTER DELETE USER", database[socket.gameid])
		socket.broadcast.emit('roomPlayerList', database)
		if (Object.keys(database[socket.gameid].players).length === 0) {
			console.log("DELETE GAME", socket.gameid)
			delete database[socket.gameid]
		}
	})

	socket.on('giveRoles', function() {
		var randomPlaceNr = parseInt(Object.keys(placesDB).length * Math.random())
		var place = Object.keys(placesDB)[randomPlaceNr]

		if (!database[socket.gameid])
			return

		if (!database[socket.gameid].players[socket.id].admin)
			return // if not admin, can't update game

		var playersLength = Object.keys(database[socket.gameid].players).length
		var spyNr = parseInt(playersLength * Math.random())

		var index = 0
		while (index < playersLength) {
			var currentPlayer = Object.keys(database[socket.gameid].players)[index]
			database[socket.gameid].players[currentPlayer].role = placesDB[place][index]
			console.log(database[socket.gameid].players[socket.id].name)
			index++
		}
		database[socket.gameid].place = place
		database[socket.gameid].players[Object.keys(database[socket.gameid].players)[spyNr]].role = 'SPY'
		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
		
	})
}

playerListUpdate = function() {

}
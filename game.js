console.log("game.js")

var database = {}
var gameStructure = {
	players: {},
	details: {
		inGame: false,
		gameTime: 300
	}
}
var userStructure = {
	name: '',
	role: '',
	admin: false,
	spectator: false
}

var placesDB = {
	Koodikool: ['Häkker', 'Tainaaju', 'Külaline', 'Rassist', 'Koer', 'Õps'],
	Kommipood: ['Mustas mantlis onu', 'Pervo', 'Väike laps', 'Välismaalane', 'Kassiir', 'Klient', 'Turvamees'],
	Kirik: ['Preester', 'Külaline', ''],
	Vangla: ["1", "2", "3", "4", "5", "6"],
	Allveelaev: ["1", "2", "3", "4", "5", "6"],
	Sõjaväebaas: ["1", "2", "3", "4", "5", "6"]
}

gameStart = function(socket) {
	
	// User tells server their username and gameid
	socket.on('register', function(data){
		username = data.username

		console.log("Register:", data)
		console.log("Username:", username)
		console.log("User's socket ID:", socket.id)
		console.log()

		var gameid = data.gameid.toLowerCase()
		var isCreator = false

		// Does gameid exist
		if (database[gameid] === undefined) {
			database[gameid] = gameStructure
			isCreator = true
		} 
		
		if (!database[gameid].players)
			database[gameid].players = {}
		database[gameid].players[socket.id] = Object.assign({}, userStructure) // writes into gameStructure for some reason
		gameStructure = {players: {}, details: {inGame: false, gameTime: 300}} // clears gameStructure
		database[gameid].players[socket.id].name = username
		
		// Assigning admin
		if (isCreator)
			database[gameid].players[socket.id].admin = isCreator
		
		// Assigning into spectator list
		if(database[gameid].details.inGame)
			database[gameid].players[socket.id].spectator = true
		
		socket.gameid = gameid
		console.log("Database:", database)
		console.log()

		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
	})

	socket.on('disconnect', function() {
		var wasAdmin = false

		console.log("User disconnected -->", socket.id)
		if (!database[socket.gameid]) {
			return
		}

		if (database[socket.gameid].players[socket.id].admin)
			wasAdmin = true

		delete database[socket.gameid].players[socket.id]
		database = JSON.parse(JSON.stringify(database))
		if (Object.keys(database[socket.gameid].players).length === 0) {
			console.log("DELETE GAME", socket.gameid)
			delete database[socket.gameid]
		}
		if(database[socket.gameid] && wasAdmin)
			database[socket.gameid].players[Object.keys(database[socket.gameid].players)[0]].admin = true
		wasAdmin = false
		console.log("DATABASE:", database)
		socket.broadcast.emit('roomPlayerList', database)
	})

	socket.on('giveRoles', function() {
		if (!database[socket.gameid].players[socket.id].admin){
			console.log()
			console.log("NON-ADMIN PLAYER TRIED TO START GAME")
			console.log()
			return // if not admin, can't start game
		}

		if(database[socket.gameid].details.inGame) {
			console.log("GAME ALREADY ON")
			return // if game is already on
		}

		database[socket.gameid].details.inGame = true

		console.log()
		console.log("-- STARTING GAME ---")
		console.log()

		var randomPlaceNr = parseInt(Object.keys(placesDB).length * Math.random())
		var place = Object.keys(placesDB)[randomPlaceNr]
		console.log("Place --> " + place)
		if (!database[socket.gameid])
			return

		var playersLength = Object.keys(database[socket.gameid].players).length
		var spyNr = parseInt(playersLength * Math.random())
		var roles = Object.values(placesDB[place])
		var rolesLength = Object.keys(placesDB[place]).length
		var index = 0

		while (index < playersLength) {
			var currentPlayer = Object.keys(database[socket.gameid].players)[index]
			var currentRoleIndex = Math.floor(Math.random() * rolesLength)
			var currentRole = roles[currentRoleIndex]

			console.log("roles:", roles)
			console.log("player:", currentPlayer)
			console.log("currentRoleIndex:", currentRoleIndex)
			console.log("currentRole:", currentRole)

			roles.splice(roles.indexOf(currentRole), 1)
			console.log("roles:", roles)

			database[socket.gameid].players[currentPlayer].role = currentRole
			console.log(database[socket.gameid].players[currentPlayer].name + " --> " + database[socket.gameid].players[currentPlayer].role)
			index++
			rolesLength--
		}
		database[socket.gameid].place = place
		database[socket.gameid].players[Object.keys(database[socket.gameid].players)[spyNr]].role = 'SPY'
		console.log("SPY --> " + database[socket.gameid].players[Object.keys(database[socket.gameid].players)[spyNr]].name)

		console.log()
		console.log(database)
		console.log(database[socket.gameid].place)
		console.log()

		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
		
	})

	socket.on('endGame', function() {
		if (!database[socket.gameid].players[socket.id].admin){
			console.log()
			console.log("NON-ADMIN PLAYER TRIED TO END GAME")
			console.log()
			return // if not admin, can't end game
		}

		if(!database[socket.gameid].details.inGame) {
			console.log("NO GAME RUNNING")
			return
		}

		console.log()
		console.log("--- ENDING GAME ---")
		console.log()

		database[socket.gameid].details.inGame = false
		database[socket.gameid].place = ''

		var playersLength = Object.keys(database[socket.gameid].players).length
		var index = 0
		while(index < playersLength) {
			var currentPlayer = Object.keys(database[socket.gameid].players)[index]
			database[socket.gameid].players[currentPlayer].role = ''
			database[socket.gameid].players[currentPlayer].spectator = false
			index++
		}
		console.log()
		console.log(database)
		console.log(database[socket.gameid].players)
		console.log()

		socket.broadcast.emit('roomPlayerList', database)
		socket.emit('roomPlayerList', database)
	})
}
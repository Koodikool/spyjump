var socket = io()

socket.emit('register', {
	username: localStorage.getItem('username'),
	gameid: localStorage.getItem('gameid')
})
socket.on('usercount', function(data){
	console.log("Usercount: ", data)
})

socket.on('errorb', function(data){
	console.log("ERROR: ", data)
})

socket.on('msg', function(data){
	console.log("Message: ", data)
})

socket.on('roomPlayerList', function(database){
	console.log("Room List: ", database)
	var gameid = localStorage.getItem('gameid')
	var game = database[gameid]
	var players = game.players
	console.log(game)
	console.log(gameid)
	Object.entries(players).forEach(function(keyvalue, obj){
		document
			.querySelector('.inimesed tbody')
			.insertAdjacentHTML("beforeend", "<tr><td>"+keyvalue[0]+"</td></tr>")
	})
})
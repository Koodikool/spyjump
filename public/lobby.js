var socket = io()

setTimeout(function(){
	socket.emit('register', {
		username: localStorage.getItem('username'),
		gameid: localStorage.getItem('gameid')
	})
},100)

document.querySelector('#kood').innerHTML = localStorage.getItem('gameid')

socket.on('usercount', function(data){
	console.log("Usercount:", data)
})

socket.on('errorr', function(data){
	console.log("ERROR:", data)
})

socket.on('msg', function(data){
	console.log("Message:", data)
})

socket.on('roomPlayerList', function(database, b, c){
	var gameid = localStorage.getItem('gameid').toLowerCase()
	var game = database[gameid]
	if (!game) {
		console.log("There's no such game")
		return
	}
	var players = game.players

	if (database[gameid].players[socket.id]) {
		var myRole = database[gameid].players[socket.id].role
		var place = database[gameid].place
		document.querySelector('#roll').innerHTML = 'Minu roll on ' + myRole
		if (myRole !== 'SPY')
			document.querySelector('#place').innerHTML = 'Koht on ' + place
		else
			document.querySelector('#place').innerHTML = ''
	}

	document.querySelector('.inimesed tbody').innerHTML = '' // Tühjenda tabel
	Object.entries(players).forEach(function(keyvalue, obj){
		var name = keyvalue[1].name
		name = name.slice(0,20) // Et liiga pikk nimi ei saaks olla
		name = name.replace('<', '')
		document
			.querySelector('.inimesed tbody')
			.insertAdjacentHTML("beforeend", "<tr><td>"+name +"</td></tr>")
	})
})

lahku = function() {
	localStorage.setItem('gameid', null)
	localStorage.setItem('username', null)
	var foSure = confirm("Kindel?")
	if (foSure)
		window.location.href = '/'
}

giveRoles = function() {
	socket.emit('giveRoles')
}
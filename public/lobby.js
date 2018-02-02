var socket = io()

setTimeout(function(){
	socket.emit('register', {
		username: localStorage.getItem('username'),
		gameid: localStorage.getItem('gameid')
	})
},100)

document.querySelector('#kood').innerHTML = localStorage.getItem('gameid').toLowerCase()

// socket.on('usercount', function(data){
// 	console.log("Usercount:", data)
// })

socket.on('errorr', function(data){
	console.log("ERROR:", data)
})

socket.on('msg', function(data){
	console.log("Message:", data)
})

socket.on('roomPlayerList', function(database){
	var gameid = localStorage.getItem('gameid').toLowerCase()
	var game = database[gameid]
	if (!game) {
		console.log("There's no such game")
		return
	}
	var players = game.players

	// console.log(details)
	console.log(database[gameid].players[socket.id])
	console.log(database[gameid].details.inGame)
	console.log(!database[gameid].players[socket.id].spectator)
	if (database[gameid].players[socket.id] && database[gameid].details.inGame && !database[gameid].players[socket.id].spectator) {
		var myRole = database[gameid].players[socket.id].role
		var place = database[gameid].place

		console.log(database[gameid].players)

		if (myRole !== 'SPY'){
			document.querySelector('#place').innerHTML = 'Koht on ' + place
		}else{
			document.querySelector('#place').innerHTML = ''
		}
	}

	if(!database[gameid].details.inGame){
		document.querySelector('#roll').innerHTML = ''
		document.querySelector('#place').innerHTML = ''
	}

	document.querySelector('.inimesed tbody').innerHTML = '' // Tühjenda tabel
	document.querySelector('.inimesed tbody:first-child').innerHTML = '<tr><th>Mängijad</th><th>Vaatajad</th></tr>'
	Object.entries(players).forEach(function(keyvalue, obj){
		var name = keyvalue[1].name
		name = name.slice(0,20) // Et liiga pikk nimi ei saaks olla
		name = name.replace('<', '')

		if(keyvalue[1].spectator){
			document
				.querySelector('.inimesed tbody tr:last-child')
				.insertAdjacentHTML("beforeend", "<td>"+name+"</td>")
		} else if(keyvalue[1].admin){
			document
				.querySelector('.inimesed tbody')
				.insertAdjacentHTML("beforeend", "<tr><td style='background-color:yellow'>"+name+"</td></tr>")
		}else {
			document
				.querySelector('.inimesed tbody')
				.insertAdjacentHTML("beforeend", "<tr><td>"+name+"</td></tr>")		
		}
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

endGame = function() {
	socket.emit('endGame')
}
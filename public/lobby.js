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
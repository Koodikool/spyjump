var user = JSON.parse(localStorage.getItem('user'))
var socket = io()

socket.emit('register', user)

socket.on('users', function(data){
	console.log("Users", data)
})

document.querySelector('form').onsubmit = function(e){
	e.preventDefault()
	var username = e.target.name.value
	var gameid = e.target.gameID.value
	console.log(username, gameid)
	
	localStorage.setItem('username', username)
	localStorage.setItem('gameid', gameid)
	
	window.location.href = '/lobby.html'
}
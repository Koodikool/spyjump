document.querySelector('form').onsubmit = function(e){
	e.preventDefault()
	var username = e.target.name.value
	var gameid = e.target.gameID.value

	localStorage.setItem('username', username)
	localStorage.setItem('gameid', gameid)

	window.location.href = '/lobby.html'
}
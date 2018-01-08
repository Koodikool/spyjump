document.querySelector('form').onsubmit = function(e){
	e.preventDefault()
	localStorage.setItem('user', JSON.stringify({
		username: e.target.name.value,
		gameid: e.target.gameID.value
	}))
	window.location.href = '/lobby.html'
}
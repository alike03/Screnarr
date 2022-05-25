

const movies = () => {
	let movies;

	fetch('http://localhost:7878/api/v3/movie?apikey=')
	.then(response => response.json())
	.then(json => movies = json)
	
	return movies
}

export default movies()

export function getMovieState(movie) {
	let state = []

	if (movie.monitored && movie.sizeOnDisk > 0) state.push('waiting')
	if (movie.monitored && movie.sizeOnDisk <= 0) state.push('missing')
	if (!movie.monitored && movie.sizeOnDisk > 0) state.push('watched')
	if (!movie.monitored && movie.sizeOnDisk <= 0) state.push('notDownloaded')

	return state
}

export function filterMovies(filter) {
	let grid = document.querySelector('section.movies').childNodes;
	let delay = 0;

	if (filter === '*') {
		grid.forEach((m, i) => {
			m.classList.remove('hidden');
			m.classList.remove('fadeIn');
			setTimeout(() => {
				m.classList.add('fadeIn');
			}, delay++ * 50);
		});
	} else {
		grid.forEach((m) => {
			if (m.classList.contains(filter)) {
				m.classList.remove('hidden');
				m.classList.remove('fadeIn');
				setTimeout(() => {
					m.classList.add('fadeIn');
				}, delay++ * 50);
			} else {
				m.classList.add('hidden');
				m.classList.remove('fadeIn');
			}
		});
	}
}

export function searchMovie(title) {
	let grid = document.querySelector('section.movies').childNodes;

	grid.forEach((m) => {
		let mTitle = m.querySelector('.title').innerText
		if (mTitle.toLowerCase().indexOf(title.toLowerCase()) > -1) {
			m.classList.remove('hidden')
			m.classList.add('fadeIn')
		} else {
			m.classList.add('hidden')
			m.classList.remove('fadeIn')
		}
	});
}
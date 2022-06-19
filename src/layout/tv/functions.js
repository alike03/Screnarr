export function getSeriesState(series) {
	let state = []

	if (series.statistics.unwatched > 0) state.push('unwatched')
	if (series.monitored) state.push('monitored')
	else state.push('unmonitored')
	if (series.status === 'ended') state.push('ended')

	return state
}

export function filterSeries(filter) {
	let grid = document.querySelector('section.tv').childNodes;
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

export function searchSeries(title) {
	let grid = document.querySelector('section.tv').childNodes;

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
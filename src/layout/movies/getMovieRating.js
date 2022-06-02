import m from 'mithril';

export function getMovieRating(movie) {
	let context = [];


	if (movie.ratings?.imdb?.value) {
		context.push(
			m("progress.imdb", {
				value: movie.ratings.imdb.value,
				max: 10
			})
		);
	}
	if (movie.ratings?.rottenTomatoes?.value) {
		context.push(
			m("progress.rotten", {
				value: movie.ratings.rottenTomatoes.value,
				max: 100
			})
		);
	}
	if (movie.ratings?.metacritic?.value) {
		context.push(
			m("progress.metacritic", {
				value: movie.ratings.metacritic.value,
				max: 100
			})
		);
	}

	return context;
}

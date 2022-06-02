export function getMovieDetails(movie) {
	let details = [];

	if (movie.digitalRelease) {
		const release = new Date(movie.digitalRelease);
		// const releaseDate = `${release.getDate()}.${release.getMonth() + 1}.${release.getFullYear()}`
		const releaseDate = `${release.getDate()}. ${release.toLocaleString('de-DE', { month: 'short' })} ${release.getFullYear()}`;
		details.push(releaseDate);
	}

	if (movie.certification) {
		const rating = movie.certification;
		details.push(rating);
	}

	if (movie.runtime) {
		const duration = movie.runtime;
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;
		const durationString = `${hours}h ${minutes}m`;
		details.push(durationString);
	}

	return details;
}

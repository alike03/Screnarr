export function getTvDetails(series) {
	let details = [];

	if (series.nextAiring) {
		const release = new Date(series.nextAiring);
		const releaseDate = `${release.getDate()}. ${release.toLocaleString('de-DE', { month: 'short' })} ${release.getFullYear()}`;
		details.push(releaseDate);
	} else if (series.ended) {
		details.push('Ended');
	}

	if (series.certification) {
		const rating = series.certification;
		details.push(rating);
	}

	if (series.runtime) {
		details.push(series.runtime + 'm');
	}

	return details;
}

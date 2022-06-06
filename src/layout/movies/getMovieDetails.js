import store from "../../components/settings"
const lang = store.get('settings.general.language')

export function getMovieDetails(movie) {
	let details = []

	if (movie.digitalRelease || movie.physicalRelease || movie.inCinemas) {
		const release = new Date(movie.digitalRelease || movie.physicalRelease || movie.inCinemas)
		const releaseDate = `${release.getDate()}. ${release.toLocaleString(lang, { month: 'short' })} ${release.getFullYear()}`
		details.push(releaseDate)
	}

	if (movie.certification) {
		details.push(movie.certification)
	}

	if (movie.runtime) {
		const duration = movie.runtime
		const hours = Math.floor(duration / 60)
		const minutes = duration % 60
		const durationString = `${hours}h ${minutes}m`
		details.push(durationString)
	}

	return details
}

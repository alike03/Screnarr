import m from 'mithril'
import store from '../components/settings'
import { shell } from 'electron'
import fs from 'fs'

let movies = []

store.onDidChange('settings.radarr', () => {
	movieFetch()
})

export function movieFetch() {
	if (!store.get('settings.radarr.enabled')) return false

	const radarr = store.get('settings.radarr')
	const url = `http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/api/v3/movie?apikey=${radarr.api}`

	m.request({
		method: 'GET',
		url: url,
	})
	.then(function(items) {
		movies = items
		store.set('settings.radarr.connected', true)
	}).catch(function(error) {
		// alert('Error: Could not fetch movies from Radarr. \nAre you sure you have the correct settings?')
		store.set('settings.radarr.connected', false)
		m.route.set('/settings')
		movies = []
	})
}

function getMovieDetails(movie) {
	let details = []

	if (movie.digitalRelease) {
		const release = new Date(movie.digitalRelease)
		// const releaseDate = `${release.getDate()}.${release.getMonth() + 1}.${release.getFullYear()}`
		const releaseDate = `${release.getDate()}. ${release.toLocaleString('de-DE', { month: 'short' })} ${release.getFullYear()}`
		details.push(releaseDate)
	}

	if (movie.certification) {
		const rating = movie.certification
		details.push(rating)
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

function getMovieContext(movie) {
	let context = []

	if (movie.ratings?.imdb?.value) {
		context.push(
			m("progress.imdb", {
				value: movie.ratings.imdb.value,
				max: 10
			})
		)
	}
	if (movie.ratings?.rottenTomatoes?.value) {
		context.push(
			m("progress.rotten", {
				value: movie.ratings.rottenTomatoes.value,
				max: 100
			})
		)
	}
	if (movie.ratings?.metacritic?.value) {
		context.push(
			m("progress.metacritic", {
				value: movie.ratings.metacritic.value,
				max: 100
			})
		)
	}

	return context
}

export function LayoutMovie() {
	const radarr = store.get('settings.radarr')

	return {
		view: () => {
			return m("section.movies", {
				class: 'flex flex-wrap'
			}, movies.map(function(movie) {
				// Skip if the movie is not yet available
				if (!movie.isAvailable) return;

				const details = getMovieDetails(movie)
				const context = getMovieContext(movie)

				console.log(movie.ratings)

				return m("div.poster", { 
					class: (movie.monitored ? '' : 'watched'),
					onmouseup: (e) => {
						// If left click, open the movie in Radarr
						if (e.button === 0) {
							let fileFound = false

							try {
								fs.readdirSync(movie.path).every(file => {
									// If file type is video, open it
									if (file.match(/\.(mkv|mp4|avi|mov|m4v|webm)$/i)) {
										shell.openPath(movie.path + '/' + file)
										fileFound = true
										return false
									}
									return true
								})
							} catch (e) {
								console.warn(e)
							}

							if (!fileFound) {
								alert('No video file found for this movie.')
							}
						} else {
							console.log(movie)
							// shell.openExternal(`http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/movie/${movie.titleSlug}`)
						}
						// Else, open the movie in the browser
					}
				}, [
					m("img", {
						remote: movie.images[0].remoteUrl,
						local: "file:///C:/ProgramData/Radarr" + movie.images[0].url,
						src: `http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/api/v3/mediacover/${movie.id}/poster-500.jpg?apikey=${radarr.api}`
					}),
					m("div.content ", [
						m("p.details", details.join(' · ')),
						m("p.title", movie.title),
						m("div.context", [context])
					])
				])
			}))
		}
	}
}
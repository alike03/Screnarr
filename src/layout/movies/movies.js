import m from 'mithril'
import { shell } from 'electron'
import fs from 'fs'

import store from 'components/settings'

import { movies, movieFetch } from './movieFetch'
import { getMovieContext } from './getMovieContext'
import { getMovieDetails } from './getMovieDetails'

let grid;

export default function LayoutMovie() {
	const radarr = store.get('settings.radarr')
	const filter = [{
			name: 'All',
			filter: '*',
		}, {
			name: 'Waiting',
			filter: '.waiting',
		}, {
			name: 'Missing',
			filter: '.missing',
		}, {
			name: 'Watched',
			filter: '.watched',
		}, {
			name: 'Not Downloaded',
			filter: '.notDownloaded',
		}
	]

	return {
		oninit: movieFetch,
		oncreate: () => {
		},
		view: () => {
			return [m("section.filter", filter.map(function(f) {
				return m("button", {
					'data-filter': f.filter,
					'onclick': (e) => {
						e.preventDefault()
					}
				}, f.name)
			})),
			m("section.movies", {
				class: 'flex flex-wrap'
			}, movies.map(function(movie) {
				// Skip if the movie is not yet available
				if (!movie.isAvailable) return;

				const details = getMovieDetails(movie)
				const context = getMovieContext(movie)

				return m("div.poster", { 
					class: 	(movie.monitored && movie.sizeOnDisk > 0 ? ' waiting' : '') +
							(movie.monitored && movie.sizeOnDisk <= 0 ? ' missing' : '') +
							(!movie.monitored && movie.sizeOnDisk > 0 ? ' watched' : '') +
							(!movie.monitored && movie.sizeOnDisk <= 0 ? ' notDownloaded' : ''),
							
							
					'data-monotored': movie.monitored,
					'data-available': movie.isAvailable,
					'data-quality': movie.quality,
					'data-status': movie.status,
					'data-sizeOnDisk': movie.sizeOnDisk,
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
							// console.log(movie)
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
			}))]
		}
	}
}
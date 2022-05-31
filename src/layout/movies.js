import m from 'mithril'
import store from '../components/settings'

async function LayoutMovie(promise) {

    const movies = await promise
	const radarr = store.get('settings.radarr')

	return {
		oncreate: () => {
			store.onDidChange('settings.radarr', () => {
				console.log('settings changed')
				m.redraw()
			})
		},
		view: () => {
			return m("section.movies", {
				class: 'flex flex-wrap'
			}, movies.map(function(movie) {
				return m("div.movie-card w-48 text-highlight-light break-words", [
					m("div.movie-card-image", [
						m("img", {
							remote: movie.images[0].remoteUrl,
							local: "file:///C:/ProgramData/Radarr" + movie.images[0].url,
							src: `http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/api/v3/mediacover/${movie.id}/poster-500.jpg?apikey=${radarr.api}`
						})
					]),

					m("div.movie-card-content ", [
						m("h2.movie-card-title", movie.title),
						m("p", movie.folderName),
						m("p", movie.path),
						m("p", movie.certification),
						m("p", movie.digitalRelease),
						m("p", movie.id),
						m("p", movie.isAvailable),
						m("p", movie.monitored),
						m("p", movie.runtime),
					])
				])
			}))
		}
	}
}

export default LayoutMovie
import m from 'mithril'
import store from 'components/settings'

export let movies = []

export const filter = [{
		name: 'All',
		filter: '*',
	}, {
		name: 'Waiting',
		filter: 'waiting',
	}, {
		name: 'Missing',
		filter: 'missing',
	}, {
		name: 'Watched',
		filter: 'watched',
	}, {
		name: 'Not Downloaded',
		filter: 'notDownloaded',
	}
]

store.onDidChange('settings.radarr', () => {
	movieFetch()
})

export function movieFetch() {
	if (!store.get('settings.radarr.enabled'))
		return false

	const radarr = store.get('settings.radarr')
	const url = `http${radarr.ssl ? 's' : ''}://${radarr.url}:${radarr.port}/api/v3/movie?apikey=${radarr.api}`

	m.request({
		method: 'GET',
		url: url,
	})
		.then(function (items) {
			items.sort(((e, i) => {
				// if (e.inCinemas && !i.inCinemas) return -1
				// if (!e.inCinemas && i.inCinemas) return 1

				// if (i.physicalRelease && !e.physicalRelease) return -1
				// if (!i.physicalRelease && e.physicalRelease) return 1

				// if (i.digitalRelease && !e.digitalRelease) return -1
				// if (!i.digitalRelease && e.digitalRelease) return 1

				// if (e.inCinemas && i.inCinemas) {
				// 	if (new Date(e.inCinemas) < new Date(i.inCinemas)) return -1
				// 	if (new Date(e.inCinemas) > new Date(i.inCinemas)) return 1
				// }

				// if (i.digitalRelease && e.digitalRelease) {
				// 	if (new Date(i.digitalRelease) < new Date(e.digitalRelease)) return -1
				// 	if (new Date(i.digitalRelease) > new Date(e.digitalRelease)) return 1
				// }
				
				// if (i.physicalRelease && e.physicalRelease) {
				// 	if (new Date(i.physicalRelease) < new Date(e.physicalRelease)) return -1
				// 	if (new Date(i.physicalRelease) > new Date(e.physicalRelease)) return 1
				// }

				const eDate = new Date(e.inCinemas || e.digitalRelease || e.physicalRelease)
				const iDate = new Date(i.inCinemas || i.digitalRelease || i.physicalRelease)

				if (eDate < iDate) return 1
				if (eDate > iDate) return -1

			    return 0
			}))


			movies = items
			store.set('settings.radarr.connected', true)
		}).catch(function (error) {
			// alert('Error: Could not fetch movies from Radarr. \nAre you sure you have the correct settings?')
			store.set('settings.radarr.connected', false)
			// m.route.set('/settings')
			movies = []
		})
}
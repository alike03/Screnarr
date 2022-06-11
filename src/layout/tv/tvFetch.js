import m from 'mithril'
import store from 'components/settings'

export let tv = []

export const filter = [{
    name: 'All',
    filter: '*'
}, {
    name: 'Monitored',
    filter: 'monitored'
}, {
    name: 'Ended',
    filter: 'ended'
}]

store.onDidChange('settings.sonarr', () => {
    tvFetch()
})

export function tvFetch() {
    if (!store.get('settings.sonarr.enabled'))
        return false

    const sonarr = store.get('settings.sonarr')
	const url = `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/`

    m.request({
			url: `${url}/api/v3/series?apikey=${sonarr.api}`
        })
        .then(function(items) {
			items.sort(((e, i) => {
				if (e.nextAiring && !i.nextAiring) return -1
				if (!e.nextAiring && i.nextAiring) return 1

				if (i.firstAired && !e.firstAired) return -1
				if (!i.firstAired && e.firstAired) return 1

				if (i.previousAiring && !e.previousAiring) return -1
				if (!i.previousAiring && e.previousAiring) return 1

				if (e.nextAiring && i.nextAiring) {
					if (new Date(e.nextAiring) < new Date(i.nextAiring)) return -1
					if (new Date(e.nextAiring) > new Date(i.nextAiring)) return 1
				}

				if (i.previousAiring && e.previousAiring) {
					if (new Date(i.previousAiring) < new Date(e.previousAiring)) return -1
					if (new Date(i.previousAiring) > new Date(e.previousAiring)) return 1
				}
				
				if (i.firstAired && e.firstAired) {
					if (new Date(i.firstAired) < new Date(e.firstAired)) return -1
					if (new Date(i.firstAired) > new Date(e.firstAired)) return 1
				}

				return 0
			}))

            store.set('settings.sonarr.connected', true)
			items.forEach(item => {
				// Fetch episode files and add to series object
				m.request({
					url:`${url}/api/v3/episodefile?seriesId=${item.id}&apikey=${sonarr.api}`,
					background: true
				}).then(function(episodefiles) {
					item.episodefiles = episodefiles
				})

				// Add to each season episode object
				item.seasons.forEach(season => {
					season.episodes = []
				})

				// Fetch episodes and merge with season in series object
				m.request({
					url: `${url}/api/v3/episode?seriesId=${item.id}&apikey=${sonarr.api}`,
					background: true
				}).then(function(episodes) {
					// item.episodes = episodes
					episodes.forEach(episode => {
						item.seasons.find(season => season.seasonNumber === episode.seasonNumber).episodes.push(episode)
					})

					// Sort
					item.seasons.sort(((e, i) => {
						if (e.seasonNumber < i.seasonNumber) return 1
						if (e.seasonNumber > i.seasonNumber) return -1
						return 0
					}))

					item.seasons.forEach(season => {
						if (!season.episodes) return
						season.episodes.sort(((e, i) => {
							if (e.episodeNumber < i.episodeNumber) return 1
							if (e.episodeNumber > i.episodeNumber) return -1
							return 0
						}))
					})
				})
			})
            tv = items
        }).catch(function(error) {
            store.set('settings.sonarr.connected', false)
            tv = []
			console.warn('Error fetching TV Shows', error)
        })
}
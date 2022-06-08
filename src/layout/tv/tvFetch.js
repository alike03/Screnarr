import m from 'mithril'
import store from 'components/settings'

export let tv = []

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
}]

store.onDidChange('settings.sonarr', () => {
    tvFetch()
})

export function tvFetch() {
    if (!store.get('settings.sonarr.enabled'))
        return false

    const sonarr = store.get('settings.sonarr')
    const url = `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/api/v3/series?apikey=${sonarr.api}`

    m.request({
            method: 'GET',
            url: url,
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

			// add showing status to each item
			// items.forEach((item) => {
			// 	item.screnarr.state = false
			// })

            tv = items

            store.set('settings.sonarr.connected', true)
        }).catch(function(error) {
            store.set('settings.sonarr.connected', false)
            tv = []
        })
}
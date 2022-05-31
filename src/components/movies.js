import m from 'mithril'
import store from '../components/settings'

async function movies() {
	const radarr = store.get('settings.radarr')

	const url = `http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/api/v3/movie?apikey=${radarr.api}`

	try {
		const response = await fetch(url)
		const json = await response.json()
		return json
	} catch (error) {
		alert('Error: Could not fetch movies from Radarr. \nAre you sure you have the correct settings?')
		m.route.set('/settings')
		return []
	}
}
export default movies()
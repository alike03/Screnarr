import m from 'mithril';
import store from 'components/settings';

export let movies = [];

store.onDidChange('settings.radarr', () => {
	movieFetch()
})

export function movieFetch() {
	if (!store.get('settings.radarr.enabled'))
		return false;

	const radarr = store.get('settings.radarr');
	const url = `http${radarr.ssl ? 's' : ''}://${radarr.url}:${radarr.port}/api/v3/movie?apikey=${radarr.api}`;

	m.request({
		method: 'GET',
		url: url,
	})
		.then(function (items) {
			movies = items
			store.set('settings.radarr.connected', true)
			movies.filter(movie => movie.isAvailable == false).forEach(movie => {
				console.log(movie)
			})
		}).catch(function (error) {
			// alert('Error: Could not fetch movies from Radarr. \nAre you sure you have the correct settings?')
			store.set('settings.radarr.connected', false)
			// m.route.set('/settings')
			movies = []
		});
}

import m from 'mithril'
import { shell } from 'electron'
import { icon } from '@fortawesome/fontawesome-svg-core'

import { toggleMonitored } from 'components/functions'
import { getMovieRating } from './getMovieRating'
import { getMovieState } from './functions'
import store from 'components/settings'

// const faSvgYoutube = icon(faYoutube, { classes: ['fa-fw'] }).html[0]
// const faSvgImdb = icon(faImdb, { classes: 'fa-fw' }).html[0]
const faSvgYoutube = icon({ prefix: 'fab', iconName: 'youtube' }).html[0]
const faSvgImdb = icon({ prefix: 'fab', iconName: 'imdb' }).html[0]
const faSvgRadar = `<svg viewBox="0 0 1024 1024" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg"><defs><clipPath id="prefix__b"><use xlink:href="#prefix__a" clip-rule="evenodd"/></clipPath><path id="prefix__a" d="M0 0h1024v1024H0z"/></defs><g clip-path="url(#prefix__b)"><use xlink:href="#prefix__a" fill="currentColor" fill-opacity="0"/><path d="M175.302 175.943l7.522 714.55c-60.173 7.521-105.302-22.566-105.302-82.738L70 213.55C70 25.511 242.996-19.618 348.298 55.598L882.33 363.982c75.216 52.651 90.259 150.431 52.651 218.125-7.521-52.65-30.086-82.737-75.216-112.823l-601.726-338.47c-45.129-30.087-82.737-22.565-82.737 45.13z" fill="currentColor"/><path d="M130.172 928.1c45.13 15.044 90.26 7.522 127.867-15.042l616.77-361.036c37.607 52.65 30.086 105.302-15.044 135.388L340.776 988.273c-75.216 37.608-172.996 0-210.604-60.172z" fill="currentColor"/><path d="M310.69 717.496l368.557-210.604L318.212 303.81l-7.522 413.687z" fill="currentColor"/></g></svg>`

const faSvgMonitored = icon({ prefix: 'fas', iconName: 'bookmark' }).html[0]
const faSvgUnmonitored = icon({ prefix: 'far', iconName: 'bookmark' }).html[0]

export function getMovieContext(movie) {
	// const movieRating = getMovieRating(movie);

	return [
			m('div.buttons', { key: movie.title }, [
				m('button.trailer', {
					onclick: () => {
						const path = `https://www.youtube.com/watch?v=${movie.youTubeTrailerId}`
						// window.open(path)
						shell.openExternal(path)
					}
				}, [
					m('span', 'Trailer'),
					m.trust(faSvgYoutube)
				]),
				m('button.ytReview', {
					onclick: () => {
						const movieTitle = movie.title.replace(/\s/g, '%20')
						const ytReview = store.get('settings.general.ytReview')
						ytReview.forEach(channel => {
							const path = `https://www.youtube.com/${channel}/search?query=${movieTitle}`
							shell.openExternal(path)
						})
					}
				}, [
					m('span', 'YouTube Reviews'),
					m.trust(faSvgYoutube)
				]),
				m('button.imdb', {
					onclick: () => {
						const path = `https://www.imdb.com/title/${movie.imdbId}`
						shell.openExternal(path)
					}
				}, [
					m('span', 'IMDB'),
					m.trust(faSvgImdb)
				]),
				m('button.radarr', {
					onclick: () => {
						const radarr = store.get('settings.radarr')
						const url = `http${radarr.ssl ? 's' : ''}://${radarr.url}:${radarr.port}/movie/${movie.titleSlug}`
						shell.openExternal(url)
					}
				}, [
					m('span', 'Radarr'),
					m.trust(faSvgRadar)
				])
			]),
			m('button.monitored', {
				class: movie.monitored ? 'active' : '',
				key: movie.monitored,
				onclick: (e) => {
					const parent = e.target.closest('.poster')
					const movieId = movie.id
					const radarr = store.get('settings.radarr')
					let api = `http${radarr.ssl ? 's' : ''}://${radarr.url}:${radarr.port}/api/v3/movie/${movieId}?apikey=${radarr.api}`

					toggleMonitored(api).then((monitored) => {
						movie.monitored = monitored
						parent.className = 'poster hidden ' + getMovieState(movie).join(' ')
						m.redraw()
					})

					if (store.get('settings.general.ytReviewOpen')) {
						const movieTitle = movie.title.replace(/\s/g, '%20')
						const ytReview = store.get('settings.general.ytReview')
						ytReview.forEach(channel => {
							const path = `https://www.youtube.com/${channel}/search?query=${movieTitle}`
							shell.openExternal(path)
						})
					}
				}
			}, [ m.trust(movie.monitored ? faSvgMonitored : faSvgUnmonitored) ])
	]
}
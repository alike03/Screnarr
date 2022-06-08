import m from 'mithril'
import store from 'components/settings'

import { getPoster } from "components/posterFunctions"

const sonarr = store.get('settings.sonarr')

let seriesEpisodes = []
let displayingSeries = null
let displayingSeason = 0

export function setDisplayingSeries(series) {
	fetchEpisodes(series.id)
	series.seasons = series.seasons.reverse()
	displayingSeason = series.seasons[0].seasonNumber
	displayingSeries = series

	setInterval(() => {
		m.redraw()
	}, 1500);
}

export function sectionActive() {
	if (!displayingSeries) return null

	return m({
		// oninit: fetchEpisodes(displayingSeries.id),
        oncreate: () => {
            document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') {
					displayingSeries = null
					document.querySelector('.poster.active')?.classList?.remove('hide')
					document.querySelector('.poster.active')?.classList?.remove('active')

					document.querySelector('section.active img.placed')?.classList?.remove('placed')
					m.redraw()
				} else {
                	document.querySelector('input').focus()
				}
            })
        },
		view: () => {
			return m("section.active", [
				m("img.cover", {
					// src: (displayingSeries ? getPoster(displayingSeries, sonarr, 'sonarr') : 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=='),
					src: getPoster(displayingSeries, sonarr, 'sonarr'),
					style: { transform: 'translate(0, 0)' },
					oncreate: (vnode) => coverClickTransition(vnode)
				}),
				seriesContainer(displayingSeries)
			])
		}
	})
}

export function coverClickTransition(vnode) {
	const sourceParent = document.querySelector('.poster.active')
	if (!sourceParent) return

	const sourceImg = sourceParent.querySelector('img')
	const rect = sourceImg.getBoundingClientRect()

	vnode.dom.style.width = sourceImg.width + 'px'
	vnode.dom.style.height = sourceImg.height + 'px'

	vnode.dom.style.transitionDuration = '0s'
	vnode.dom.style.transform = 'translate(' + 
		// (rect.left - 28 - document.querySelector('nav').clientWidth) + 'px, ' + 
		// (rect.top  - 28 - document.querySelector('header').clientHeight) + 'px)'
		(rect.left - document.querySelector('nav').clientWidth) + 'px, ' + 
		(rect.top  - document.querySelector('header').clientHeight) + 'px)'

	setTimeout(() => {
		// Starting animation imidiately causes the image to flicker
		sourceParent.classList.add('hide')
	}, 100)
	setTimeout(() => {
		vnode.dom.style.transitionDuration = '1s'
		vnode.dom.style.transform = 'translate(40px, 40px)'
		vnode.dom.classList.add('placed')
	}, 500)
}

export function seriesContainer(displayingSeries) {
	let fanart = displayingSeries.images.filter(i => i.coverType === 'fanart')[0]?.url
	if (fanart) {
		const sonarr = store.get('settings.sonarr')
		const url = `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/`
		fanart = url + fanart
	}
	
	return m("div.content ", [
		m("div.details", {
			style: {
				"margin-left": document.querySelector('.poster.active img').width + 40 + 'px'
			}
		}, [
			// m("p.details", getTvDetails(series).join(' · ')),
			m("h2.title", displayingSeries.title),
			// m("div.context", getMovieContext(series))
			m('select', {
				onchange: (e) => {
					console.log(e.target.value)
				}
			}, displayingSeries.seasons.map(function(season) {
				return m('option', {
					value: season.seasonNumber,
				}, `Season ${season.seasonNumber}`)
			})),
			m("div.episodes", seriesEpisodes.map(function(episode) {
				if (episode.seasonNumber !== displayingSeason) return
				return m("div.episode", [
					m("div.number", episode.episodeNumber),
					m("div.title", episode.title)
				])
			})),
			fanart ? m("img.fanart", { src: fanart }) : null
		])
	])
}

function fetchEpisodes(id) {
    const sonarr = store.get('settings.sonarr')
    let episodes = []
    let episodeFiles = []

	m.request({
		method: 'GET',
		url: `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/api/v3/episode?seriesId=${id}&apikey=${sonarr.api}`,
		background: true
	})
	.then(function(items) {
		episodes = items

		m.request({
			method: 'GET',
			url: `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/api/v3/episodefile?seriesId=${id}&apikey=${sonarr.api}`,
			background: true
		})
		.then(function(items) {
			episodeFiles = items

			// console.log(seriesEpisodes)
			// console.log(seriesEpisodeFiles)
			// seriesEpisodes = seriesEpisodes.map(function(episode) {
			// 	episode.episodeFile = seriesEpisodeFiles.filter(function(episodeFile) {
			// 		return episodeFile.episodeId === episode.id
			// 	})[0]
			// 	return episode
			// })
			seriesEpisodes = episodes
			m.redraw()
		})
	})
}

export default sectionActive
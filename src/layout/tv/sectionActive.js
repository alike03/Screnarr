import m from 'mithril'
import store from 'components/settings'

import { getPoster } from "components/posterFunctions"


let seriesEpisodes = []
let displayingSeason = []
let parentNode = null

const sonarr = store.get('settings.sonarr')
const url = `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/`

export function sectionActive(series, section) {
	parentNode = section

	return {
		oninit: () => {
			fetchEpisodes(series.id, series.seasons.at(-1).seasonNumber)
		},
        oncreate: () => {
            document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') {
					// displayingSeries = null
					document.querySelector('.poster.active')?.classList?.remove('hide')
					document.querySelector('.poster.active')?.classList?.remove('active')

					section.classList.add('hidden')
					section.classList.remove('placed')
					m.mount(section, null)
				} else {
                	document.querySelector('input').focus()
				}
            })
        },
		view: () => {
			return [
				viewFanart(series),
			    m('div.infos', [
			        m("img.cover", {
			            src: getPoster(series, sonarr, 'sonarr'),
			            style: { transform: 'translate(0, 0)' },
			            oncreate: (vnode) => coverClickTransition(vnode)
			        }),
			        seriesInfo(series)
			    ]),
			    viewSeriesEpisodes()
			]
		}
	}
}

function coverClickTransition(vnode) {
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
		(rect.left - 56 - document.querySelector('nav').clientWidth) + 'px, ' + 
		(rect.top - 56 - document.querySelector('header').clientHeight) + 'px)'

	setTimeout(() => {
		// Starting animation imidiately causes the image to flicker
		sourceParent.classList.add('hide')
	}, 100)
	setTimeout(() => {
		vnode.dom.style.transitionDuration = '1s'
		vnode.dom.style.transform = 'translate(0, 0)'
		parentNode.classList.add('placed')
	}, 500)
}

function seriesInfo(series) {
	const seasons = [...series.seasons].reverse()
	// displayingSeason = seriesEpisodes.filter(s => s.seasonNumber == seasons[0].seasonNumber)
	
	return m("div.fade", [
		m("div.details", [
			// m("p.details", getTvDetails(series).join(' · ')),
			m("h2.title", series.title),
			// m("div.context", getMovieContext(series))
			m('select', {
				onchange: (e) => {
					displayingSeason = seriesEpisodes.filter(s => s.seasonNumber == e.target.value)
				}
			}, seasons.map((season) => {
				return m('option', {
					value: season.seasonNumber,
				}, `Season ${season.seasonNumber}`)
			}))
		])
	])
}

function viewSeriesEpisodes() {
	return m("div.episodes.fade", displayingSeason.map(function(episode) {
		return m("div.episode", [
			m("div.number", episode.episodeNumber),
			m("div.title", episode.title)
		])
	}))
}

function viewFanart(series) {
	let fanart = series.images.filter(i => i.coverType === 'fanart')[0]?.url
	if (fanart) {
		return m('div.fade.fanart', [
			m("img", { src: url + fanart })
		])
	}

	return null
}

function fetchEpisodes(id, season) {
    let episodes = []
    let episodeFiles = []

	m.request({
		method: 'GET',
		url: `${url}/api/v3/episode?seriesId=${id}&apikey=${sonarr.api}`,
		background: true
	})
	.then(function(items) {
		episodes = items

		m.request({
			method: 'GET',
			url:`${url}/api/v3/episodefile?seriesId=${id}&apikey=${sonarr.api}`,
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
			displayingSeason = seriesEpisodes.filter(s => s.seasonNumber == season)
			m.redraw()
		})
	})
}

export default sectionActive
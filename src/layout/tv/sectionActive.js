import m from 'mithril'
import { shell } from 'electron'
import store from 'components/settings'
import { icon } from '@fortawesome/fontawesome-svg-core'

import { getPoster } from "../../components/posterFunctions"
import { toggleMonitored, getFileSize } from '../../components/functions'
import { faSvgImdb, faSvgSonarr, faSvgTvdb, faSvgTvmaze } from '../../components/logos'

let parentNode = null
let latest = null

const sonarr = store.get('settings.sonarr')
const lang = store.get('settings.general.language')
const url = `http${sonarr.ssl ? 's' : ''}://${sonarr.url}:${sonarr.port}/`

const faSvgMonitored = icon({ prefix: 'fas', iconName: 'bookmark' }).html[0]
const faSvgUnmonitored = icon({ prefix: 'far', iconName: 'bookmark' }).html[0]

export function sectionActive(series, section) {
	parentNode = section
	latest = null

	return {
        oncreate: () => {
			window.onpopstate = function(event) {
				closeSection(section)
			}
            document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') {
					closeSection(section)
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
			    seriesEpisodes(series)
			]
		}
	}
}

function closeSection(section) {
	if (!parentNode.classList.contains('hidden')) {
		document.querySelector('.poster.active')?.classList?.remove('hide')
		document.querySelector('.poster.active')?.classList?.remove('active')

		section.classList.add('hidden')
		section.classList.remove('placed')
		m.mount(section, null)
	}
}

function coverClickTransition(vnode) {
	const sourceParent = document.querySelector('.poster.active')
	if (!sourceParent) return

	const sourceImg = sourceParent.querySelector('img')
	const rect = sourceImg.getBoundingClientRect()

	vnode.dom.style.width = sourceImg.width + 'px'
	vnode.dom.style.height = sourceImg.height + 'px'

	// 56 is the padding
	parentNode.querySelector('.infos').style.width = sourceImg.width + 56 + 'px'

	vnode.dom.style.transitionDuration = '0s'
	vnode.dom.style.transform = 'translate(' + 
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
	let year = `since ${series.year}`
	if (series.status == 'ended') {
		const lastEp = series.previousAiring ? new Date(series.previousAiring).getFullYear() : 'ended'
		year = `${series.year} - ${lastEp}`
	}

	return m("div.details.fade", [
		m("h2.title", series.title),
		m("button.justify-center", {
			onclick: () => {
				shell.openPath(latest.path)
			}
		}, "Watch Latest Episode"),
		m("button.justify-center", {
			onclick: () => {
				shell.openPath(series.path)
			}
		}, "Open Folder"),
		m("p.details", [
			m("span", year),
			series.runtime && m("span", `${series.runtime} min`),
			series.network && m("span", `${series.network}`),
			series.certification && m("span", `${series.certification}`),
			m("span", `${series.genres.join(', ')}`)
		]),
		m("div.buttons", [
			m("div.sonarr", {
				onclick: () => shell.openExternal(`${url}series/${series.titleSlug}`)
			}, [m.trust(faSvgSonarr)]),
			series.imdbId && m("div.imdb", {
				onclick: () => shell.openExternal(`https://www.imdb.com/title/${series.imdbId}`)
			}, [m.trust(faSvgImdb)]),
			series.tvdbId && m("div.tvdb", {
				onclick: () => shell.openExternal(`https://thetvdb.com/?tab=series&id=${series.tvdbId}`)
			}, [m.trust(faSvgTvdb)]),
			series.tvMazeId && m("div.tvmaze", {
				onclick: () => shell.openExternal(`https://www.tvmaze.com/shows/${series.tvMazeId}`)
			}, [m.trust(faSvgTvmaze)])
		])
	])
}

function seriesEpisodes(series) {
    return m("div.episodes.fade", series.seasons.map(function(season) {
        return [
            m("div.season", [
                m("button.monitored", {
                    onclick: () => {
						let api = `${url}api/v3/series/${series.id}?apikey=${sonarr.api}`
						toggleMonitored(api, season.seasonNumber).then(monitored => {
							season.monitored = monitored
							m.redraw()
						})
                    }
                }, [m.trust(season.monitored ? faSvgMonitored : faSvgUnmonitored)]),
                m('div.info', [
					m("h3", season.seasonNumber === 0 ? 'Specials' : `Season ${season.seasonNumber}`),
					getSeasonStatus(season)
				])
            ]),
            m("div", !season.episodes ? null : season.episodes.map(function(episode) {
				const file = episode.episodeFileId ? series.episodefiles.filter(f => f.id === episode.episodeFileId)[0] : null
				const release = new Date(episode.airDate)
				if (file && episode.monitored) latest = file

                return m("div.episode", [
                    m("button.monitored", {
                        onclick: () => {
							let api = `${url}api/v3/episode/${episode.id}?apikey=${sonarr.api}`
							toggleMonitored(api).then(monitored => {
								episode.monitored = monitored
								m.redraw()
							})
                        }
                    }, [m.trust(episode.monitored ? faSvgMonitored : faSvgUnmonitored)]),
                    m("button.details", {
                        class: (file ? 'available' : 'disabled') + (episode.monitored ? ' monitored' : ' unmonitored'),
                        onclick: (e) => file?.path && shell.openPath(file.path)
                    }, [
                        m("div.number", episode.episodeNumber),
                        m("div.title", episode.title),
						file?.quality?.quality?.resolution && m("div.quality.badge", file.quality.quality.resolution + 'p'),
						file?.size && m("div.size.badge", getFileSize(file.size)),
                        episode.airDate && m("div.airdate", `${release.getDate()}. ${release.toLocaleString(lang, { month: 'short' })} ${release.getFullYear()}`)
                    ])
                ])
            }))
        ]
    }))
}

function getSeasonStatus(season) {
	// const episdoeCount = series.seasons.statistics.totalEpisodeCount
	const episodeCount = season.statistics.monitored
	const availibleCount = season.statistics.episodeFileCount

	const colors = ['#f44336', '#ff9800', '#4caf50']
	const color = episodeCount === availibleCount || episodeCount < availibleCount ? colors[2] : episodeCount > 0 ? colors[1] : colors[0]

	return availibleCount > 0 && m("div.size.badge", {style: `background-color: ${color}`}, `${availibleCount}/${episodeCount}`)
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

export default sectionActive
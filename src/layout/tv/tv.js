import store from 'components/settings'
import { shell } from 'electron'
import m from 'mithril'

import waitForElement from '../../components/waitForElement'
import { calculatePosterWidth, getPoster } from "../../components/posterFunctions"
import { filterSeries, searchSeries, getSeriesState } from './functions'
import { filter, tv, tvFetch } from './tvFetch'
import { getTvDetails } from './getTvDetails'
import { sectionActive } from './sectionActive'

export default function LayoutTv() {
    const sonarr = store.get('settings.sonarr')

    return {
        oninit: tvFetch,
        oncreate: (vnode) => {
            document.addEventListener('keypress', () => {
                vnode.dom.querySelector('input').focus()
            })
        },
        view: () => {
            return [m("section.filter", [
                    filter.map(function(f) {
                        return m("button", {
                            'data-filter': f.filter,
                            'oncreate': () => {
                                const filter = store.get('settings.sonarr.filter')
                                document.querySelector(`[data-filter="${filter}"]`).classList.add('active')

                                waitForElement('section.tv .poster').then(() => {
                                    const area = document.querySelector('section.filter')
                                    calculatePosterWidth(area, true)
                                    window.addEventListener('resize', () => calculatePosterWidth(area))

                                    filterSeries(filter)
                                })
                            },
                            'onclick': (e) => {
                                const filter = e.target.dataset.filter
                                store.set('settings.sonarr.filter', filter)
                                e.target.parentNode.childNodes.forEach(n => {
                                    n.classList.remove('active')
                                })
                                e.target.classList.add('active')

                                filterSeries(filter)
                            }
                        }, f.name)
                    }),
                    m("input.search", {
                        onkeydown: (e) => {
                            // if pressed key is escape clear search
                            if (e.keyCode === 27) {
                                e.target.value = ''
                                e.target.classList.remove('active')
								searchSeries(e.target.value)
                            }
                        },
                        oninput: (e) => {
                            if (e.target.value.length > 0) {
                                e.target.classList.add('active')
                            } else {
                                e.target.classList.remove('active')
                            }
							searchSeries(e.target.value)
                        }
                    })
                ]),
				m("section.active.hidden"),
                m("section.tv", {
                    class: 'flex flex-wrap'
                }, tv.map(function(series) {

                    return m("div.poster.fadeIn", {
                        class: getSeriesState(series).join(' '),
                        onmouseup: (e) => {
                            if (e.target.nodeName === 'BUTTON') return;

                            if (e.button === 0) {
								e.target.closest('.poster').classList.add('active')

								const section = document.querySelector('section.active')
								section.classList.remove('hidden')
								m.mount(section, sectionActive(series, section))
								
								const url = new URL(window.location);
								url.searchParams.set('series', series.id);
								window.history.pushState({}, '', url);
                            } else {
                                shell.openExternal(`http${sonarr.ssl ?'s':''}://${sonarr.url}:${sonarr.port}/series/${series.titleSlug}`)
                            }
                        }
                    }, [
                        m("img", {
							src: getPoster(series, sonarr, 'sonarr'),
                        }),
						series.statistics.unwatched > 0 && m('div.count', series.statistics.unwatched),
                        m("div.content ", [
                            m("p.details", getTvDetails(series).join(' · ')),
                            m("p.title", series.title)
                            // m("div.context", getMovieContext(series))
                        ])
                    ])
                }))
            ]
        }
    }
}
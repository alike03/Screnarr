import store from 'components/settings'
import { shell } from 'electron'
import fs from 'fs'
import m from 'mithril'

import waitForElement from '../../components/waitForElement'
import { calculatePosterWidth, getPoster } from "../../components/posterFunctions"
import { filterMovies, searchMovie, getMovieState } from '../movies/functions'
import { getMovieContext } from '../movies/getMovieContext'
import { filter, tv, tvFetch } from './tvFetch'
import { getTvDetails } from './getTvDetails'
import { sectionActive, setDisplayingSeries, coverClickTransition, seriesContainer } from './sectionActive'

export default function LayoutTv() {
    const sonarr = store.get('settings.sonarr')

    return {
        oninit: tvFetch,
        view: () => {
            return [/*m("section.filter", [
                    filter.map(function(f) {
                        return m("button", {
                            'data-filter': f.filter,
                            'oncreate': () => {
								//TODO: Filter TV
                                // const filter = store.get('settings.tv.filter')
                                // document.querySelector(`[data-filter="${filter}"]`).classList.add('active')

                                waitForElement('section.tv .poster').then(() => {
                                    const area = document.querySelector('section.filter')
                                    calculatePosterWidth(area, true)
                                    window.addEventListener('resize', () => calculatePosterWidth(area))

									//TODO: Filter TV
                                    // filterMovies(filter)
                                })
                            },
                            'onclick': (e) => {
                                const filter = e.target.dataset.filter
                                store.set('settings.movies.filter', filter)
                                e.target.parentNode.childNodes.forEach(n => {
                                    n.classList.remove('active')
                                })
                                e.target.classList.add('active')

								//TODO: Filter TV
                                // filterMovies(filter)
                            }
                        }, f.name)
                    }),
                    m("input.search", {
                        onkeydown: (e) => {
                            // if pressed key is escape clear search
                            if (e.keyCode === 27) {
                                e.target.value = ''
                                e.target.classList.remove('active')
                                searchMovie(e.target.value)
                            }
                        },
                        oninput: (e) => {
                            if (e.target.value.length > 0) {
                                e.target.classList.add('active')
                            } else {
                                e.target.classList.remove('active')
                            }
                            searchMovie(e.target.value)
                        }
                    })
                ]),
				*/
				sectionActive(),
                m("section.tv", {
                    class: 'flex flex-wrap'
                }, tv.map(function(series) {
					
					// console.log(series)

                    return m("div.poster", {
						// TODO: Filter - get series state as class
						// monitored, ended, 
                        // class: getMovieState(series).join(' ')
                        class: 'fadeIn',
                        onmouseup: (e) => {
                            if (e.target.nodeName === 'BUTTON') return;

                            if (e.button === 0) {
								e.target.closest('.poster').classList.add('active')
								setDisplayingSeries(series)
                            } else {
                                shell.openExternal(`http${sonarr.ssl ?'s':''}://${sonarr.url}:${sonarr.port}/movie/${movie.titleSlug}`)
                            }
                        }
                    }, [
                        m("img", {
							src: getPoster(series, sonarr, 'sonarr'),

                        }),
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
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
import { mainModule } from 'process'

export default function LayoutTv() {
    const sonarr = store.get('settings.sonarr')
	let displayingSeries = null

    return {
        oninit: tvFetch,
        oncreate: (vnode) => {
            document.addEventListener('keydown', (e) => {
				if (e.key === 'Escape') {
					displayingSeries = null
					document.querySelector('.poster.active')?.classList?.remove('hide')
					document.querySelector('.poster.active')?.classList?.remove('active')
					m.redraw()
				} else {
                	vnode.dom.querySelector('input').focus()
				}
            })
        },
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
				m("section.active", {
				    class: displayingSeries ? 'showing' : 'hidden'
				}, [
					m("img.cover", {
						src: (displayingSeries ? getPoster(displayingSeries, sonarr, 'sonarr') : 'blank'),
						style: { transform: 'translate(0, 0)' },
						onupdate: (vnode) => {
							const sourceParent = document.querySelector('.poster.active')
							const sourceImg = sourceParent.querySelector('img')
							const rect = sourceImg.getBoundingClientRect()

							vnode.dom.style.width = sourceImg.width + 'px'
							vnode.dom.style.height = sourceImg.height + 'px'

							vnode.dom.style.transitionDuration = '0s'
							// vnode.dom.style.left = rect.left - document.querySelector('nav').clientWidth + 'px'
							// vnode.dom.style.top = rect.top + document.querySelector('main').scrollTop - document.querySelector('header').clientHeight + 'px'
							// vnode.dom.style.transform = 'translate(' + (rect.left - 28 - document.querySelector('nav').clientWidth) + 'px, ' + (rect.top + document.querySelector('main').scrollTop - document.querySelector('header').clientHeight) + 'px)'
							vnode.dom.style.transform = 'translate(' + 
								// (rect.left - 24 - document.querySelector('nav').clientWidth) + 'px, ' + 
								// (rect.top  - 18 - document.querySelector('header').clientHeight) + 'px)'
								(rect.left - 28 - document.querySelector('nav').clientWidth) + 'px, ' + 
								(rect.top  - 28 - document.querySelector('header').clientHeight) + 'px)'

							setTimeout(() => {
								// Starting animation imidiately causes the image to flicker
								sourceParent.classList.add('hide')
							}, 100)
							setTimeout(() => {
								vnode.dom.style.transitionDuration = '1s'
								vnode.dom.style.transform = 'translate(50px, 50px)'
							}, 500)
						}
					}),
					displayingSeries ? 
						m("div.content ", {
						}, [
							// m("p.details", getTvDetails(series).join(' · ')),
							m("p.title", displayingSeries.title),
							// m("div.context", getMovieContext(series))
						])
					: null
				]),
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
								displayingSeries = series
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
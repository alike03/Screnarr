import store from 'components/settings'
import { shell } from 'electron'
import fs from 'fs'
import m from 'mithril'

import waitForElement from '../../components/waitForElement'
import { calculatePosterWidth, getPoster } from "../../components/posterFunctions"
import { filterMovies, searchMovie, getMovieState } from './functions'
import { getMovieContext } from './getMovieContext'
import { getMovieDetails } from './getMovieDetails'
import { filter, movieFetch, movies } from './movieFetch'

export default function LayoutMovie() {
    const radarr = store.get('settings.radarr')

    return {
        oninit: movieFetch,
        oncreate: (vnode) => {
            document.addEventListener('keypress', (e) => {
                vnode.dom.querySelector('input').focus()
            })
        },
        view: () => {
            return [m("section.filter", [
                    filter.map(function(f) {
                        return m("button", {
                            'data-filter': f.filter,
                            'oncreate': () => {
                                const filter = store.get('settings.movies.filter')
                                document.querySelector(`[data-filter="${filter}"]`).classList.add('active')

                                waitForElement('section.movies .poster').then(() => {
                                    const area = document.querySelector('section.filter')
                                    calculatePosterWidth(area, true)
                                    window.addEventListener('resize', () => calculatePosterWidth(area))

                                    filterMovies(filter)
                                })
                            },
                            'onclick': (e) => {
                                const filter = e.target.dataset.filter
                                store.set('settings.movies.filter', filter)
                                e.target.parentNode.childNodes.forEach(n => {
                                    n.classList.remove('active')
                                })
                                e.target.classList.add('active')

                                filterMovies(filter)
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
                m("section.movies", {
                    class: 'flex flex-wrap'
                }, movies.map(function(movie) {
                    // Skip if the movie is not yet available
                    if (!movie.isAvailable) return;

                    return m("div.poster", {
                        class: getMovieState(movie).join(' '),
                        onmouseup: (e) => {
                            if (e.target.nodeName === 'BUTTON') return;

                            // If left click, open the movie in Radarr
                            if (e.button === 0) {
                                // let fileFound = false

                                // try {
                                //     fs.readdirSync(movie.path).every(file => {
                                //         // If file type is video, open it
                                //         if (file.match(/\.(mkv|mp4|avi|mov|m4v|webm)$/i)) {
                                //             shell.openPath(movie.path + '/' + file)
                                //             fileFound = true
                                //             return false
                                //         }
                                //         return true
                                //     })
                                // } catch (e) {
                                //     console.warn(e)
                                // }

                                // if (!fileFound) {
                                //     alert('No video file found for this movie.')
                                // }

                                if (movie.hasFile) {
                                    shell.openPath(movie.movieFile.path)
                                } else {
									alert(movie.title + ' has no file')
								}
                            } else {
                                shell.openExternal(`http${radarr.ssl ?'s':''}://${radarr.url}:${radarr.port}/movie/${movie.titleSlug}`)
                            }
                        }
                    }, [
                        m("img", {
							src: getPoster(movie, radarr, 'radarr'),
                        }),
                        m("div.content ", [
                            m("p.details", getMovieDetails(movie).join(' · ')),
                            m("p.title", movie.title),
                            m("div.context", getMovieContext(movie))
                        ])
                    ])
                }))
            ]
        }
    }
}
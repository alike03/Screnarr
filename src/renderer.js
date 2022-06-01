import m from 'mithril'
import store from './components/settings'

import '@fontsource/voces'
import './index.css'
import './vendor/fontawesome'

// import settings from './components/settings'
import Navbar from './components/navbar'

import { movieFetch, LayoutMovie } from './layout/movies'
import LayoutTv from './layout/tv'
import LayoutSettings from './layout/settings'


const Layout = {
    view: function(vnode) {
        return [...vnode.children, m(Navbar)]
    }
}

const defaultPath = store.get('settings.radarr.enabled') ? '/movie' : store.get('settings.sonarr.enabled') ? '/tv' : '/settings'

m.route(document.body, defaultPath, {
	"/movie": {
		oninit: movieFetch,
		view: function() {
			return m(Layout, m(LayoutMovie))
		},
	},
	"/tv": {
		view: function() {
			return m(Layout, m(LayoutTv))
		},
	},
	"/settings": {
		view: function() {
			return m(Layout, m(LayoutSettings))
		},
	},
})
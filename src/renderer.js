import m from 'mithril'
import store from './components/settings'

import '@fontsource/voces'
import './index.css'
import './vendor/fontawesome'

// import settings from './components/settings'
import Navbar from './components/navbar'
import Header from './components/header'

import LayoutMovie from './layout/movies/movies'
import LayoutTv from './layout/tv/tv'
import LayoutSettings from './layout/settings'


let Layout = {
    view: function(vnode) {
        return [m(Header), m(Navbar), m('main', [...vnode.children])]
    }
}

const defaultPath = store.get('settings.radarr.enabled') ? '/movie' : store.get('settings.sonarr.enabled') ? '/tv' : '/settings'

m.route(document.body, defaultPath, {
	"/movie": {
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
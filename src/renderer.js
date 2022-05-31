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

m.route(document.body, "/", {
	"/": {
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
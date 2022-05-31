import m from 'mithril'
import store from './components/settings'

import '@fontsource/voces'
import './index.css'
import './vendor/fontawesome'

// import settings from './components/settings'
import movies from './components/movies'
import Navbar from './components/navbar'

import LayoutMovie from './layout/movies'
import LayoutTv from './layout/tv'
import LayoutSettings from './layout/settings'


const Layout = {
    view: function(vnode) {
        return [...vnode.children, m(Navbar)]
    }
}

LayoutMovie(movies).then(function(Movies) {
	m.route(document.body, "/", {
		"/": {
			view: function() {
				return m(Layout, m(Movies))
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
})
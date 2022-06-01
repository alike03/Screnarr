import m from 'mithril'
import store from '../components/settings'

function loadTabs() {
	const currentRoute = m.route.get()
	let tabs = []

	if (store.get('settings.radarr.enabled')) {
		tabs.push(m(m.route.Link, {
			href: "/movie",
			class: 'icon group' + (currentRoute === '/movie' ? ' active' : ''),
			key: 'movie'
		}, [
			m('i.navbar-item', { href: '/', class: 'fas fa-film' }),
			m('span', { class: 'tooltip group-hover:scale-100' }, 'Movies'),
		]))
	}

	if (store.get('settings.sonarr.enabled')) {
		tabs.push(m(m.route.Link, {
			href: "/tv",
			class: 'icon group' + (currentRoute === '/tv' ? ' active' : ''),
			key: 'tv'
		}, [
			m('i.navbar-item', { href: '/', class: 'fas fa-tv' }),
			m('span', { class: 'tooltip group-hover:scale-100' }, 'TV Shows')
		]))
	}
	
	tabs.push(m(m.route.Link, {
		href: "/settings",
		class: 'icon group' + (currentRoute === '/settings' ? ' active' : ''),
		key: 'settings'
	}, [
		m('i.navbar-item', { href: '/', class: 'fas fa-cog' }),
		m('span', { class: 'tooltip group-hover:scale-100' }, 'Settings')
	]))

	return tabs
}

// oninit(vnode) 	Runs before a vnode is rendered into a real DOM element
// oncreate(vnode) 	Runs after a vnode is appended to the DOM
// onupdate(vnode) 	Runs every time a redraw occurs while the DOM element is attached to the document
// onbeforeremove(vnode) 	Runs before a DOM element is removed from the document. If a Promise is returned, Mithril.js only detaches the DOM element after the promise completes. This method is only triggered on the element that is detached from its parent DOM element, but not on its child elements.
// onremove(vnode) 	Runs before a DOM element is removed from the document. If a onbeforeremove hook is defined, onremove is called after done is called. This method is triggered on the element that is detached from its parent element, and all of its children
// onbeforeupdate(vnode, old) 	Runs before onupdate and if it returns false, it prevents a diff for the element and all of its children

function Navbar() {

	return {
		oninit: () => {
			store.onDidChange('settings.radarr.enabled', () => m.redraw())
			store.onDidChange('settings.sonarr.enabled', () => m.redraw())
		},
		view: () => {
			const tabs = loadTabs()
			return m('nav', tabs)
		}
	}
}

export default Navbar
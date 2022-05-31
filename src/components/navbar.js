import m from 'mithril'

function Navbar() {

	return {
		view: () => {
			return m('nav', [
				m(m.route.Link, {
					href: "/",
					class: 'icon group'
				}, [
					m('i.navbar-item', { href: '/', class: 'fas fa-film' }),
					m('span', { class: 'tooltip group-hover:scale-100' }, 'Movies'),
				]),
				m(m.route.Link, {
					href: "/tv",
					class: 'icon group'
				}, [
					m('i.navbar-item', { href: '/', class: 'fas fa-tv' }),
					m('span', { class: 'tooltip group-hover:scale-100' }, 'TV Shows')
				]),
				m(m.route.Link, {
					href: "/settings",
					class: 'icon group'
				}, [
					m('i.navbar-item', { href: '/', class: 'fas fa-cog' }),
					m('span', { class: 'tooltip group-hover:scale-100' }, 'Settings')
				])
			])
		}
	}
}

export default Navbar
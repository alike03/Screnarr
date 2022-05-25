import m from 'mithril'

const root = document.body

const buttonStyle = 'bg-highlight-dark text-white hover:bg-highlight-light hover:text-background-dark  relative flex items-center justify-center h-12 w-12 mt-2 mb-2 mx-auto shadow-lg rounded-3xl hover:rounded-xl transition-all duration-300 ease-linear cursor-pointer'
const tooltipStyle = 'text-black bg-highlight-light  absolute w-auto p-2 m-2 min-w-max left-14 rounded-md shadow-md text-xs font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100'

m.mount(root, {
	view: () => {
		return m('div.nav', { class: 'fixed top-0 left-0 h-screen w-16 flex flex-col bg-background-dark text-white shadow-lg' }, [
			m('a', { class: 'sidebar-icon group ' + buttonStyle }, [
				m('i.navbar-item', { href: '/', class: 'fas fa-film' }),
				m('span.sidebar-tooltip', { class: tooltipStyle, }, 'Movies'),
			]),
			m('a', { class: 'sidebar-icon group ' + buttonStyle }, [
				m('i.navbar-item', { href: '/', class: 'fas fa-tv' }),
				m('span.sidebar-tooltip', { class: tooltipStyle }, 'TV Shows')
			]),
			m('a', { class: 'sidebar-icon group ' + buttonStyle }, [
				m('i.navbar-item', { href: '/', class: 'fas fa-cog' }),
				m('span.sidebar-tooltip', { class: tooltipStyle }, 'Settings')
			])
		])
	}
})
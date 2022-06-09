import m from 'mithril'
import store from 'components/settings'


export default function LayoutSeries(id) {
	console.log('LayoutSeries', id)
	return {
		// oninit: fetchEpisodes(displayingSeries.id),
		oncreate: () => {
			console.log('LayoutSeries', id)
		},
		view: () => {
			return m("section.active", {class: 'bg-red w-full h-full'})
		}
	}
}
import m from 'mithril'

function TV() {

	return {
		view: () => {
			return m("section.tv", [
				m("h2", "TV"),
				m("p", "TV"),
			])
		}
	}
}

export default TV
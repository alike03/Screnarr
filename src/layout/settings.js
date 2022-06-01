import m from 'mithril'
import store from '../components/settings'

function Settings() {

	return {
		view: () => {
			return m("section.settings", [
				m("h1", "Settings"),
				m("form", [
					m('fieldset', [
						m("legend", "Radarr"),
						m('button.reset', {
							type: "button",
							onclick: () => { store.reset('settings.radarr') }
						}, "Reset"),
						m("label.check", [
							m("span", "Enabled"),
							m("input[type=checkbox]", {
								checked: store.get('settings.radarr.enabled'),
								onchange: (e) => store.set('settings.radarr.enabled', e.target.checked)
							})
						]),
						m("label.check", [
							m("span", "SSL"),
							m("input[type=checkbox]", {
								checked: store.get('settings.radarr.ssl'),
								onchange: (e) => store.set('settings.radarr.ssl', e.target.checked)
							})
						]),
						m("label", [
							m("span", "URL"),
							m("input[type=text]", {
								value: store.get('settings.radarr.url'),
								oninput: (e) => store.set('settings.radarr.url', e.target.value)
							})
						]),
						m("label", [
							m("span", "Port"),
							m("input[type=text]", {
								value: store.get('settings.radarr.port'),
								oninput: (e) => store.set('settings.radarr.port', e.target.value)
							})
						]),
						m("label", [
							m("span", "API"),
							m("input[type=text]", {
								value: store.get('settings.radarr.api'),
								oninput: (e) => store.set('settings.radarr.api', e.target.value)
							})
						]),
						getStatusInfo(store.get('settings.radarr.connected'))
					]),
					m('fieldset', [
						m("legend", "Sonarr"),
						m('button.reset', {
							type: "button",
							onclick: () => { store.reset('settings.sonarr') }
						}, "Reset"),
						m("label.check", [
							m("span", "Enabled"),
							m("input[type=checkbox]", {
								checked: store.get('settings.sonarr.enabled'),
								onchange: (e) => store.set('settings.sonarr.enabled', e.target.checked)
							})
						]),
						m("label.check", [
							m("span", "SSL"),
							m("input[type=checkbox]", {
								checked: store.get('settings.sonarr.ssl'),
								onchange: (e) => store.set('settings.sonarr.ssl', e.target.checked)
							})
						]),
						m("label", [
							m("span", "URL"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.url'),
								oninput: (e) => store.set('settings.sonarr.url', e.target.value)
							})
						]),
						m("label", [
							m("span", "Port"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.port'),
								oninput: (e) => store.set('settings.sonarr.port', e.target.value)
							})
						]),
						m("label", [
							m("span", "API"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.api'),
								oninput: (e) => store.set('settings.sonarr.api', e.target.value)
							})
						]),
						getStatusInfo(store.get('settings.sonarr.connected'))
					])
				])
			])
		}
	}
}

function getStatusInfo(status) {
	return m("div", { 
		class: 'status ' + (status ? "success" : "error")
	}, [
		// m("i", { class: status ? "fa fa-check" : "fa fa-times" }),

		// <span class="fa-stack fa-lg">
		// 	<i class="fa fa-circle fa-stack-2x"></i>
		// 	<i class="fa fa-flag fa-stack-1x fa-inverse"></i>
		// </span> 
		// m("span.fa-stack.fa-lg", [
		// 	m("i.fa fa-circle fa-stack-2x"),
		// 	m("i.fa.fa-stack-1x.fa-inverse", { class: status ? "fa-check" : "fa-times" })
		// ]),

		// <i class="fa-brands fa-facebook-f" data-fa-transform="shrink-3.5 down-1.6 right-1.25" data-fa-mask="fa-solid fa-circle" style="background:MistyRose"></i>
		m("i.fa.fa-xl", {
			'class': status ? "fa-check" : "fa-times",
			'data-fa-transform': "shrink-4",
			'data-fa-mask': "fa-solid fa-circle",
		}),
		m("span", status ? "Connected" : "Disconnected"),
	])
}

export default Settings
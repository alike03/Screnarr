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
						m("label", [
							m("span", "URL"),
							m("input[type=text]", {
								value: store.get('settings.radarr.url'),
								oninput: (e) => store.set('settings.radarr.url', e.target.value)
							})
						]),
						m("label", [
							m("span", "API"),
							m("input[type=text]", {
								value: store.get('settings.radarr.api'),
								oninput: (e) => store.set('settings.radarr.api', e.target.value)
							})
						]),
						m("label", [
							m("span", "Port"),
							m("input[type=text]", {
								value: store.get('settings.radarr.port'),
								oninput: (e) => store.set('settings.radarr.port', e.target.value)
							})
						]),
						m("label.check", [
							m("span", "SSL"),
							m("input[type=checkbox]", {
								checked: store.get('settings.radarr.ssl'),
								onchange: (e) => store.set('settings.radarr.ssl', e.target.checked)
							})
						]),
					]),
					m('fieldset', [
						m("legend", "Sonarr"),
						m('button.reset', {
							type: "button",
							onclick: () => { store.reset('settings.sonarr') }
						}, "Reset"),
						m("label", [
							m("span", "URL"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.url'),
								oninput: (e) => store.set('settings.sonarr.url', e.target.value)
							})
						]),
						m("label", [
							m("span", "API"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.api'),
								oninput: (e) => store.set('settings.sonarr.api', e.target.value)
							})
						]),
						m("label", [
							m("span", "Port"),
							m("input[type=text]", {
								value: store.get('settings.sonarr.port'),
								oninput: (e) => store.set('settings.sonarr.port', e.target.value)
							})
						]),
						m("label.check", [
							m("span", "SSL"),
							m("input[type=checkbox]", {
								checked: store.get('settings.sonarr.ssl'),
								onchange: (e) => store.set('settings.sonarr.ssl', e.target.checked)
							})
						]),
					])
				])
			])
		}
	}
}

export default Settings
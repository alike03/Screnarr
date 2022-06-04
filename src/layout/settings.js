import m from 'mithril'
import { resolve } from 'mithril/promise/promise'
import store from '../components/settings'

function Settings() {

	return {
		view: () => {
			return m("section.settings", [
				// m("h1", "Settings"),
				m("form", [
					m('fieldset', [
						m("legend", "General"),
						m('button.reset', {
							type: "button",
							onclick: () => { store.reset('settings.general') }
						}, "Reset"),
						m("label", [
							m("span", "Youtube Review (one channel id per line)"),
							m("textarea", {
								value: store.get('settings.general.ytReview').join('\n'),
								rows: store.get('settings.general.ytReview').length,
								spellcheck: false,
								oninput: (e) => {
									const lines = e.target.value.split('\n')
									store.set('settings.general.ytReview', lines)
									// set hight of textarea to match content
									e.target.setAttribute('rows', lines.length)
								}
							})
						]),
						m("label.check", [
							m("span", "Open Reviews after unmonitoring"),
							m("input[type=checkbox]", {
								checked: store.get('settings.general.ytReviewOpen'),
								onchange: (e) => store.set('settings.general.ytReviewOpen', e.target.checked)
							})
						])
					]),
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
	return m('div', [
		m("div", {
			class: 'status ' + (status ? "success" : "error"),
			key: status ? "success" : "error"
		}, [
			m("i.fa.fa-xl", {
				'class': status ? "fa-check" : "fa-times",
				'data-fa-transform': "shrink-4",
				'data-fa-mask': "fa-solid fa-circle",
			}),
			m("span", status ? "Connected" : "Disconnected"),
		])
	])
}

export default Settings
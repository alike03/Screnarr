import m from 'mithril'
// import remote from 'remote'
// import { BrowserWindow } from 'electron'
// import ipc from 'electron/ipcRenderer'
const ipc = require('electron').ipcRenderer;

import { titles } from './navbar'

function getWindowStateClassName(windowState) {
    if (windowState) return 'far fa-window-restore'

    return 'far fa-window-maximize'
}

function Header() {

	return {
		view: () => {
            const currentPage = m.route.get().substring(1)
            const title = titles[currentPage]
            document.title = title + ' • Screnarr'

            let windowState = false
            ipc.invoke('window-maximize').then((state) => {
                windowState = state
            })

			return m('header', { class: 'title-bar' }, [
				m('div', { class: 'title-container' }, [
					m('div', { class: 'title' }),
					m('div', { class: 'title-bar-btns' }, [
						m('button', { 
							class: 'min-btn', 
							onclick: () => ipc.send('window-minimize'),
						}, [
							m('i', { class: 'fas fa-window-minimize' })
						]),
						m('button', {
							class: 'max-btn',
							onclick: () => ipc.invoke('window-maximize', true)
						}, [
							m('i', {
								class: getWindowStateClassName(false),
								oncreate: (obj) => {
									// TODO: Fix; doesn't work because of font awesome svg replacement
									// ipc.invoke('window-maximize').then((e, state) => obj.dom.className = getWindowStateClassName(state))
									//ipc.on('window-fullscreen', (e, state) => obj.dom.className = getWindowStateClassName(state))
								}
							})
						]),
						m('button', {
							class: 'close-btn',
							onclick: () => ipc.send('window-close'),
						}, [
							m('i', { class: 'fas fa-xmark' })
						]),
					])
				]),
            ])
		}
	}
}

export default Header
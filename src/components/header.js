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

    // <div class="title-bar">
    //     <div class="title">My Life For The Code</div>
    //     <div class="title-bar-btns">
    //         <button class="min-btn"></button>
    //         <button class="max-btn"></button>
    //         <button class="close-btn"></button>
    //     </div>
    // </div>

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
                m('h1', { class: 'title' }, title),
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
                                ipc.invoke('window-maximize').then((e, state) => obj.dom.className = getWindowStateClassName(state))
                                ipc.on('window-fullscreen', (e, state) => obj.dom.className = getWindowStateClassName(state))
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
            ])
		}
	}
}

export default Header
const electron = require('electron')
const screen = electron.screen

const Store = require('electron-store')
const store = new Store()

function getWindowSettings() {
	// store.clear()
	let window = store.get('window', {
		x: 0,
		y: 0,
		width: 1000,
		height: 800,
		fullscreen: false
	})

	if (window.x == 0) {
		window.x = screen.width / 2 - window.width / 2
	}

	if (window.y == 0) {
		window.y = screen.height / 2 - window.height / 2
	}

	return window
}

function setWindowSettings(type, args) {
	switch (type) {
		case 'moved':
			store.set('window.x', args[0])
			store.set('window.y', args[1])
			break;
	
		case 'fullscreen':
			store.set('window.fullscreen', args)
			break;
		default:
			store.set('window', {
				y: args.y,
				x: args.x,
				width: args.width,
				height: args.height
			})
			break;
	}
}

module.exports = {
	store: store,
	getWindowSettings: getWindowSettings,
	setWindowSettings: setWindowSettings
}

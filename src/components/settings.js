import Store from "electron-store"
// import { app } from "electron"
// import { name, version } from "../../package.json"
// import settingsSchema from "../electron/settings.schema"

const store = new Store({
    name: "settings",
    // cwd: `${app.getPath("appData")}/${name}`,
    // schema: settingsSchema,
    clearInvalidConfig: true,
    // projectVersion: version,
    migrations: {},
	defaults: {
		// window: {
		// 	width: 800,
		// 	height: 600,
		// 	x: 0,
		// 	y: 0,
		// 	maximized: false,
		// },
		settings: {
			radarr: {
				url: "localhost",
				api: "",
				port: 7878,
				ssl: false
			},
			sonarr: {
				url: "localhost",
				api: "",
				port: 8989,
				ssl: false
			},
		},
	}
})

export default store
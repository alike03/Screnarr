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
	// TODO: Migrate to schema
	defaults: {
		// window: {
		// 	width: 800,
		// 	height: 600,
		// 	x: 0,
		// 	y: 0,
		// 	maximized: false,
		// },
		settings: {
			general: {
				language: "en",
				ytReview: [],
			},
			radarr: {
				enabled: false,
				ssl: false,
				url: "localhost",
				port: 7878,
				api: "",
				connected: false,
				filter: '*',
			},
			sonarr: {
				enabled: false,
				ssl: false,
				url: "localhost",
				port: 8989,
				api: "",
				connected: false,
				filter: '*',
			},
		},
	}
})

export default store
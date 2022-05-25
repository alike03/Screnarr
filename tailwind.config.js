const colors = require('tailwindcss/colors')

module.exports = {
    content: [
		"./src/*.{html,js}",
		"./src/**/*.{html,js}"
	],
    theme: {
        extend: {
			colors: {
				'background': '#00171f',
				'background-dark': '#000f14',
				'highlight-dark': '#003459',
				'highlight': '#007ea7',
				'highlight-light': '#00a8e8'
			}
		},
    },
    plugins: [],
}
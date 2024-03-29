const rules = require('./webpack.rules');
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const path = require('path');

rules.push({
    test: /\.css$/,
    use: [{
        loader: 'style-loader'
    }, {
        loader: 'css-loader'
    }, {
		loader: 'postcss-loader',
		options: {
			postcssOptions: {
				plugins: [
					require('autoprefixer'),
					require('tailwindcss')
				]
			}
		}
	}],
});

module.exports = {
    // Put your normal webpack config below here
    module: {
        rules,
    },
	plugins: [
		new NodePolyfillPlugin()
	],
    target: 'electron-renderer',
	experiments: {
		// asyncWebAssembly: true,
		// topLevelAwait: true
	},
	resolve: {
		modules: [ 
			path.resolve(__dirname, 'src'),
			'node_modules'
		],
	},
    externals: [{
        // 'electron-config': 'electron-config',
		// 'electron': 'require("electron")',
		// 'electron-store': 'require("electron-store")'
    }]
};
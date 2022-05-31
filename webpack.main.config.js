module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/main.js',
    // Put your normal webpack config below here
	devtool: "source-map",
    target: 'electron-main',
    module: {
        rules: require('./webpack.rules'),
    },
};
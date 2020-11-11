const path = require('path');
const nodeExternals = require('webpack-node-externals');
const copyPlugin = require('copy-webpack-plugin');
const { ProvidePlugin } = require('webpack');

module.exports = [{
    mode: 'development',
    target: 'node',
    entry: [path.join(__dirname, 'src', 'api', 'index.js')],
    externals: [nodeExternals()],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'api'),
    },
    node: {
        // Looks like webpack messes with Node globals: https://webpack.js.org/configuration/node/
        // We don't want that when building for node, so we disable it.
        __dirname: false,
        __filename: false,
    },
}, {
    mode: 'development',
    target: 'web',
    entry: [path.join(__dirname, 'src', 'web', 'index.js')],
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist', 'web'),
    },
    resolve: {
        fallback: {
            crypto: 'crypto-browserify',
            buffer: 'buffer', // dependency of crypto-browserify
            stream: 'stream-browserify', // dependency of crypto-browserify
        },
    },
    plugins: [
        new ProvidePlugin({
            process: 'process/browser',
        }),
        new copyPlugin({
            patterns: [{from: path.join('src', 'web', 'index.html'), to: 'index.html'}],
        }),
    ],
}];

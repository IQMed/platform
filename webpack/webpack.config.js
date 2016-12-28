var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

const rootDir = path.resolve(__dirname, '../');

module.exports = {
    devtool: 'eval-source-map',
    context: rootDir,
    entry: {
        common: ["react", "react-router", "react-router-redux"],
        bundle: [
            'webpack-hot-middleware/client?reload=true',
            path.resolve(rootDir, 'src/app/main.js')
        ]
    },
    output: {
        path: path.resolve(rootDir, '/dist'),
        publicPath: '/',
        filename: '[name].js',
        chunkFilename: '[name]_[chunkhash].js',
        pathInfo: false
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/, // A regexp to test the require path. accepts either js or jsx
                loader: 'babel',
                query: {
                    presets: ['react', 'es2015', 'stage-0', 'react-hmre']
                },
                exclude: [
                    /node_modules/,
                    /bower_components/,
                ],
            },{
                test: /\.json?$/,
                loader: 'json'
            },{
                test: /\.css/,
                exclude: [/node_modules/, /bower_components/],
                loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'

            },{
                test: /(\.gif|\.png)/,
                exclude: [/node_modules/, /bower_components/],
                loader: 'url?limit=10000'

            }]
    },
    plugins: [
        new CommonsChunkPlugin({name: "common"}),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};
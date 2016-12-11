var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var scripts = require('./scripts')

var rootDir = path.resolve(__dirname, '../');
var node_modules = path.resolve(rootDir, 'node_modules');
var bower_components = path.resolve(rootDir, 'bower_components');

var scripts = require('./scripts');


scripts.aliases.react = "/node_modules/react/react.js" // for better debug

var aliases = _.mapValues(scripts.aliases, function (scriptPath) {
    return path.resolve(rootDir + scriptPath)
});

module.exports = {
    devtool: 'eval-source-map',
    context: rootDir,
    resolve: {
        alias: aliases
    },
    entry: _.merge({
        bundle: [
            'webpack-hot-middleware/client?reload=true',
            path.resolve(rootDir, 'src/app/main.jsx')
        ]
    }, scripts.chunks),
    output: {
        path: path.resolve(rootDir, '/dist'),
        publicPath: '/',
        filename: '[name].js',
        pathInfo: true
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
                test: /\.less$/,
                exclude: [/node_modules/],
                loader: 'style!css!less!autoprefixer-loader?browsers=last 10 versions'

            },{
                test: /\.css/,
                exclude: [/node_modules/],
                loader: 'style!css?modules&localIdentName=[name]---[local]---[hash:base64:5]'

            },{
                test: /(\.gif|\.png)/,
                exclude: [/node_modules/],
                loader: 'url?limit=10000'

            }],
        noParse: _.values(_.pick(aliases, scripts.noParse))
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "web/index.tpl.html",
            inject: "body",
            filename: "index.html"
        }),
        new webpack.optimize.OccurenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify('development')
        })
    ]
};
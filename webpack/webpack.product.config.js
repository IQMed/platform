var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugins = require("extract-text-webpack-plugin");
var CleanWebpackPlugin = require('clean-webpack-plugin');

const rootDir = path.resolve(__dirname, '../');

var config = {
    devtool: 'cheap-module-source-map ',
    context: rootDir,
    entry:{
        common: ['react', 'react-redux', 'react-router', 'react-router-redux'
        ],
        bundle: [
            path.resolve(rootDir, 'static/app.sass'),
            path.resolve(rootDir, 'src/app/main.js')
        ]
    },
    output: {
        path: path.resolve(rootDir, 'dist'),
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
                    presets: ['react', 'es2015', 'stage-0']
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
                exclude: [/bower_components/],
                loader: ExtractTextPlugins.extract("style", "css")

            },{
                test: /\.s[ac]ss$/,
                loader: ExtractTextPlugins.extract(["raw", "sass?sourceMap"])
            },{
                test: /\.(gif|png|eot|woff|woff2|ttf|svg)/,
                exclude: [/bower_components/],
                loader: 'url?limit=10000'

            }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {
            root: rootDir,
            verbose: true,
            dry: false,
            exclude: ['index.html']
        }),
        new CommonsChunkPlugin("common", "common.js"),
        new ExtractTextPlugins("[name].css"),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            compressor: {
                warnings: false
            },
            debug: true,
            minimize: true,
            sourceMap: true,
            exclude: [
                /node_modules/,
                /bower_components/
            ]
        }),
        new webpack.optimize.AggressiveMergingPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};

module.exports = config;
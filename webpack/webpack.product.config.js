var path = require('path');
var webpack = require('webpack');
var Clean = require('clean-webpack-plugin');

var config = {
    entry:{
            bundle: './src/app/main.jsx'
    },
    output: {
        path: path.resolve(__dirname, '../web/build'),
        publicPath: 'build/',
        filename: '[name].js',
        pathinfo: true,
    },
    devtool: 'cheap-module-source-map ',
    plugins: [
        new Clean('../web/build'),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            minimize: true,
            sourceMap: false,
            exclude: [
                /node_modules/,
                /bower_components/
            ]
        }),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    ]
};

module.exports = config;
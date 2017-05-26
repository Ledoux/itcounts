const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs')
const gzipSize = require('gzip-size')
const path = require('path')
const webpack = require('webpack')

const config = require('./config')

const ROOT_DIR = path.join(__dirname, '../')

module.exports = Object.assign(
  config,
  {
    entry: Object.assign(
      {
        index: config.entry.index
      }
    ),
    module: {
      loaders: config.module.loaders.concat([{
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg)$/,
          loader: 'url-loader?limit=30000&name=/fonts/[name].[ext]'
        },
        {
          test: /\.s?css$/,
          loader: ExtractTextPlugin.extract('style', 'css!postcss!sass'),
          exclude: /node_modules/
        }
      ])
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      }),
      new ExtractTextPlugin('styles/index_bundle.css', { allChunks: true }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      function () {
        this.plugin('done', function (stats) {
          const filename = stats.compilation.outputOptions.filename.replace('[hash]', stats.hash)
          const filepath = path.join(stats.compilation.outputOptions.path, filename)
          fs.readFile(filepath, (err, data) => {
            if (err) { console.log('error reading js bundle', err) }
            const byteSize = gzipSize.sync(data)
            const kbSize = Math.round(byteSize / 1024)
            console.log('\n\nGZIP size\n', filename + ': ~', kbSize, 'kB\n')
          })
        })
      }
    ]
  }
)

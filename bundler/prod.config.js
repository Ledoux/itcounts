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
    output: {
      path: path.join(ROOT_DIR, 'backend/servers/express-webrouter/app/static/scripts'),
      publicPath: 'static/scripts/',
      filename: 'index_bundle.js'
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      function () {
        this.plugin('done', function (stats) {
          const filename = stats.compilation.outputOptions.filename
          console.log('filename', filename)
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

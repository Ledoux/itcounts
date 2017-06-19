const autoprefixer = require('autoprefixer')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const fs = require('fs')
const gzipSize = require('gzip-size')
const path = require('path')
const webpack = require('webpack')

const config = require('./config')
const onProdDone = require('./onProdDone.js').default

module.exports = Object.assign({},
  config,
  {
    module: {
      rules: config.module.rules.concat([
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg)$/,
          use: 'url-loader?limit=30000&name=/fonts/[name].[ext]'
        },
        {
          test: /\.s?css$/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  plugins: function () {
                    return [autoprefixer]
                  }
                }
              },
              'sass-loader'
            ]
          }),
          // exclude: /node_modules/
        }
      ])
    },
    plugins: [
      new webpack.DefinePlugin({ 'process.env': { NODE_ENV: '"production"' } }),
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
      },
      new ExtractTextPlugin({
        filename: 'styles/index_bundle.css'
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true
        }
      }),
      function () {
        this.plugin('done', function (stats) {
          onProdDone(stats)
        })
      }
    ]
  }
)

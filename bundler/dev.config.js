const webpack = require('webpack')

const config = require('./config')

const HOST = '0.0.0.0'
const PORT = 3000

const hotAssetsServer = {
  host: HOST,
  port: PORT,
  url: `http://${HOST}:${PORT}`
}

module.exports = Object.assign(
  config,
  { hotAssetsServer: hotAssetsServer },
  {
    devtool: 'source-map',
    entry: Object.assign({
      index: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${hotAssetsServer.url}`,
        'webpack/hot/only-dev-server'
      ].concat(config.entry.index)
    }),
    module: {
      loaders: config.module.loaders.concat([{
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg)$/,
          loader: 'url-loader?limit=30000'
        },
        {
          test: /\.s?css$/,
          loader: 'style!css!postcss!sass',
          exclude: /node_modules/
        },
        {
          test: /plugin\.css$/,
          loaders: [
            'style', 'css',
          ],
        }
      ])
    },
    output: Object.assign(config.output, {
      publicPath: `${hotAssetsServer.url}${config.output.publicPath}/`
    }),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ]
  }
)

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
    entry: Object.assign(
      {
        index: [
          'react-hot-loader/patch',
          `webpack-dev-server/client?${hotAssetsServer.url}`,
          'webpack/hot/only-dev-server'
        ].concat(config.entry.index)
      }
    ),
    output: Object.assign(
      config.output,
      {
        publicPath: `${hotAssetsServer.url}/${config.output.publicPath}`
      }
    ),
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.ProvidePlugin({
        'Promise': 'exports?global.Promise!es6-promise',
        'fetch': 'imports?this=>global!exports?global.fetch!whatwg-fetch'
      })
    ]
  }
)

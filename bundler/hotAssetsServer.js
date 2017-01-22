const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const config = require('./dev.config')

const HOST = config.hotAssetsServer.host
const PORT = config.hotAssetsServer.port

new WebpackDevServer(
  webpack(config),
  {
    contentBase: 'backend/express-webrouter/templates/',
    hot: true,
    historyApiFallback: true,
    publicPath: config.output.publicPath
  }
).listen(PORT, HOST, function (err, result) {
  if (err) {
    return console.log(err)
  }
})

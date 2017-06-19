const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')

const devConfig = require('./dev.config')
const serverConfig = require('./server.config.js')

const HOST = serverConfig.host
const PORT = serverConfig.port

new WebpackDevServer(webpack(devConfig),
  {
    contentBase: 'backend/servers/express-webrouter/app/templates/',
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    hot: true,
    historyApiFallback: true,
    publicPath: devConfig.output.publicPath,

    // provide less noisy output from webpack
    quiet: false,
    noInfo: false,
    stats: {
      assets: false,
      colors: true,
      version: false,
      hash: false,
      timings: false,
      chunks: false,
      chunkModules: false
    }
  }
).listen(PORT, HOST, function (err, result) {
  if (err) {
    return console.log(err)
  }
  console.log(`You hot server is available here http://${HOST}:${PORT}`)
})

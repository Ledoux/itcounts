const path = require('path')

const ROOT_DIR = path.join(__dirname, '../')

module.exports = {
  entry: {
    index: [
      'babel-polyfill',
      path.join(ROOT_DIR, 'frontend/scripts/index.js')
    ]
  },
  module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader?cacheDirectory'
    }]
  },
  output: {
    path: path.join(ROOT_DIR, 'backend/servers/express-webrouter/app/static'),
    publicPath: '/static',
    filename: 'scripts/index_bundle.js'
  }
}

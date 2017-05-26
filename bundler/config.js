const path = require('path')
const autoprefixer = require('autoprefixer')

const ROOT_DIR = path.join(__dirname, '../')

module.exports = {
  entry: {
    index: [
      path.join(ROOT_DIR, 'frontend/scripts/index.js')
    ]
  },
  output: {
    path: path.join(ROOT_DIR, 'backend/servers/express-webrouter/app/static'),
    publicPath: '/static',
    filename: 'scripts/index_bundle.js'
  },
  module: {
    loaders: [{
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/
      }
    ]
  },
  postcss: [
    autoprefixer()
  ]
}

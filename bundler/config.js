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
    path: path.join(ROOT_DIR, 'backend/servers/express-webrouter/app/static/scripts'),
    publicPath: 'static/scripts/',
    filename: 'index_bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      },
      {
        test: /\.(ttf|eot|svg|png)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader'
      },
      {
        test: /\.s?css$/,
        loader: 'style!css!postcss!sass',
        exclude: /node_modules/
      },
      {
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

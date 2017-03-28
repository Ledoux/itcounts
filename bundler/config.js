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
        test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/,
        loader: 'url-loader?limit=30000&name=[name]-[hash].[ext]'
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

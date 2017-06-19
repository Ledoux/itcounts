const webpack = require('webpack')

const config = require('./config')
const serverConfig = require('./server.config.js')

module.exports = Object.assign({},
  config,
  {
    devtool: 'source-map',
    entry: Object.assign({
      index: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?${serverConfig.url}`,
        'webpack/hot/only-dev-server'
      ].concat(config.entry.index)
    }),
    module: {
      rules: config.module.rules.concat([{
          test: /\.s?css$/,
          // exclude: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(eot|woff|woff2|ttf|otf|svg|png|jpg)$/,
          use: 'url-loader?limit=30000'
        }
      ])
    },
    output: Object.assign({},
      config.output,
      {
        // note that the output.publicPath has already a slash at the beginning
        publicPath: `${serverConfig.url}${config.output.publicPath}/`
      }
    ),
    plugins: [
      new webpack.HotModuleReplacementPlugin()
    ]
  })

require('babel-polyfill')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const ejs = require('ejs')

const {
  IS_LOCALHOST,
  IS_DEV,
  IS_SANDBOX
} = require('./lib/config')
const { getModelWithApp } = require('./lib/model')
const { setApisWithAppAndModel } = require('./lib/apis')

// in localhost condition we need to import
// the secret values from a secret script
if (IS_LOCALHOST) {
  const env = require('node-env-file')
  const envType = IS_DEV
  ? 'development'
  : (IS_SANDBOX
  ? 'sandbox'
  : null)
  if (envType) {
    env(`${__dirname}/../scripts/${envType}_secret.sh`)
  }
}

const app = express()
app.set('view engine', 'html')
app.engine('html', ejs.renderFile)
app.use(express.static(path.join(__dirname, '')))
app.use(bodyParser.json())
app.use(bodyParser.json({ type: 'application/vnd.api+json' }))

const {
 PORT
} = process.env
app.set('port', (PORT || 5000))

function redirectHome (req, res) {
  const indexFileName = process.env.TYPE === 'localhost'
  ? '_dev_index.html'
  : '_prod_index.html'
  res.render(path.join(__dirname, `templates/${indexFileName}`))
}

getModelWithApp(app, { mongoUrl: process.env.MONGO_URL }).then(
  model => {
    setApisWithAppAndModel(app, model)
    app.get('/*', redirectHome)
  }
)

module.exports.app = app

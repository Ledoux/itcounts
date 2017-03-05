require('babel-polyfill')
const bodyParser = require('body-parser')
const express = require('express')
const path = require('path')
const ejs = require('ejs')

const { getModelWithApp } = require('./lib/model')
const { setApisWithAppAndModel } = require('./lib/apis')

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

app.get('/', function (req, res) {
  const indexFileName = process.env.TYPE === 'localhost'
  ? '_dev_index.html'
  : '_prod_index.html'
  res.render(path.join(__dirname, `templates/${indexFileName}`))
})

getModelWithApp(app).then(
  model => setApisWithAppAndModel(app, model)
)

module.exports.app = app

const http = require('http')

const app = require('../app').app;

const server = http.Server(app)

const PORT = app.get('port')

server.listen(PORT, function () {
  console.log('Server available at http://0.0.0.0:' + PORT)
})

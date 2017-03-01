'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getModelWithApp = getModelWithApp;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secret = JSON.parse(_fs2.default.readFileSync(_path2.default.join(__dirname, '../../config/secret.json')));
_mongoose2.default.Promise = global.Promise;

function getModelWithApp(app) {
  return new global.Promise(function (resolve, reject) {
    _mongoose2.default.connect(secret.MONGO_URL);
    _mongoose2.default.connection.on('error', function (err) {
      console.log(err);
    });
    _mongoose2.default.connection.on('connected', function () {
      var mongooseConnection = _mongoose2.default.createConnection(secret.MONGO_URL);
      console.log('Connection to mongo is okay');
      resolve({
        mongooseConnection: mongooseConnection,
        Deputes: mongooseConnection.model('', {}, 'deputes')
      });
    });
  });
}
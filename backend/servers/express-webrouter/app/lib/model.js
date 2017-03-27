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

_mongoose2.default.Promise = global.Promise;

function getModelWithApp(app, config) {
  var mongoUrl = config.mongoUrl;

  return new global.Promise(function (resolve, reject) {
    _mongoose2.default.connect(mongoUrl);
    _mongoose2.default.connection.on('error', function (err) {
      console.log(err);
      resolve({
        mongooseConnection: null,
        Deputes: null
      });
    });
    _mongoose2.default.connection.on('connected', function () {
      var mongooseConnection = _mongoose2.default.createConnection(mongoUrl);
      console.log('Connection to mongo is okay');
      resolve({
        mongooseConnection: mongooseConnection,
        Deputes: mongooseConnection.model('', {}, 'deputes')
      });
    });
  });
}
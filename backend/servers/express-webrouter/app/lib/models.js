'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deputes = exports.mongooseConnection = undefined;

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mongoUrl = "mongodb://ec2-52-211-76-129.eu-west-1.compute.amazonaws.com:27017/wax_dfg";

_mongoose2.default.Promise = global.Promise;
var mongooseConnection = exports.mongooseConnection = _mongoose2.default.createConnection(mongoUrl);

var Deputes = exports.Deputes = mongooseConnection.model('', {}, 'deputes');
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// DEV is for localhost with dev tools (watchers, hot server...)
// SANDBOX is for locahost with build and prod server
// STG (staging) is for heroku with prod condition but not the production platform
// PLATFORM heroku with no breaks allowed on it

var IS_NODE = exports.IS_NODE = process && !process.browser;
var IS_WEB = exports.IS_WEB = !IS_NODE && typeof document !== 'undefined';
var IS_SANDBOX = exports.IS_SANDBOX = process.env.NODE_ENV === 'sandbox';
var IS_DEV = exports.IS_DEV = IS_NODE ? !IS_SANDBOX && process.env.NODE_ENV !== 'production' : /^(local|0\.0|192\.)/.test(window.location.hostname);
var IS_PROD = exports.IS_PROD = IS_NODE ? !IS_SANDBOX && process.env.NODE_ENV === 'production' : !IS_DEV;
var IS_LOCALHOST = exports.IS_LOCALHOST = IS_DEV || IS_SANDBOX;
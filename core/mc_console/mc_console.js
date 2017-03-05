//core/mc_console/mc_console.js
//This is a core module that handles a connection to MC server console
'use strict';

const events = require('events');

var _consoleEngine;
var _terminal;
var _online;

function init(config, modules) {
  //Load selected engine
  _consoleEngine = require("./"+config.mcConsoleModule);
  _consoleEngine.init(config, modules, backendExports);

  _terminal = modules.core.terminal;
  _online = [];
}

function receiveLine( line ) {
  //Process and display the line from a console
  const regex = /^(\[\d{2}:\d{2}:\d{2}\]) (\[.*\]): (.*)$/g;
  var m = regex.exec(line);
  if (!m || !m[3]) {
    _terminal.notify("Console: Unhandled message received");
    _terminal.notify(line);
    return;
  }
  _terminal.consoleLine( m[1], m[2], m[3] );
  module.exports.emit('message', m[3]);
}

function sendCommand( command ) {
  _consoleEngine.sendCommand( command );
}

function setOnline( online ) {
  _online = online;
  module.exports.emit('onlineUpdated', _online);
}

function getOnline() {
  return _online;
}

//This is exposed only to the console engine
var backendExports = {
  receiveLine: receiveLine,
  setOnline: setOnline
}

module.exports = {
  init: init,
  sendCommand: sendCommand,
  getOnline: getOnline
};

module.exports.__proto__ = new events.EventEmitter();
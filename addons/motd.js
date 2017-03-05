//addons/motd.js
//This is Message of the Day addon.
//It automatically sends a message to any player after they log in
'use strict';

require('util');

var _message;
var _mcConsole;

function init(config, modules) {
  _message = config.addons.motd.message;
  _mcConsole = modules.core.mcConsole;

  //Skip initial console messages
  setTimeout(function(){
    _mcConsole.on('message', consoleMessageHandler);
  }, 10000);
}

function consoleMessageHandler( msg ) {
  var match = msg.match(/^([A-Za-z0-9_]{3,16}) joined the game$/);
  if (!match) return;
  var name = match[1];
  var command = "tellraw " + name
    + ' ["",{"text":"Welcome, ' + name +'! \n","color":"green"},{"text":"' + _message + '","color":"yellow"}]';
  _mcConsole.sendCommand(command.replace(/[\n]/g, '\\n'));
}

function setMotd( message ){
  _message = message;
}

module.exports = {
  init: init
};
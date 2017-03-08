//core/terminal/color.js
//This is "color" terminal. It uses chalk to differentiate between types of messages.
'use strict';

const readline = require('readline');
const chalk = require('chalk');

var _mcConsole;
var _errLevel;

function init(config, modules) {
  _mcConsole = modules.core.mcConsole;
  _errLevel = config.terminal.errLevel;

  //Create command-line interface
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  //Read input
  rl.on('line', line => { processInput( line ) });
}

function processInput( line ) {
  //All commands beginning with "/" are sent as console commands to MC server
  if (line[0] === '/') {
    _mcConsole.sendCommand( line.substr(1) );
    return;
  }
  switch( line ) {
    case 'exit':
    case 'quit':
      process.exit();
      break;
    default:
      console.log(chalk.yellow('Unknown command'));
  }
}

function consoleLine( time, stream, msg ) {
  console.log( chalk.grey(time) + " " + chalk.blue(stream) + " " + msg );
  if (_errLevel === 0) console.warn( time + " " + stream + " " + msg );
}

function notify( msg ) {
  console.log( chalk.blue(msg) );
  if (_errLevel <= 1) console.warn( msg );
}

function error( msg ) {
  console.log( chalk.red(msg) );
  if (_errLevel <= 2) console.warn( msg );
}

module.exports = {
  init: init,
  consoleLine: consoleLine,
  notify: notify,
  error: error
};
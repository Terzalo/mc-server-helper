//core/terminal/index.js
//This core module loads the selected terminal
'use strict';

function init(config) {
  //Load the terminal
  var terminal = require("./"+config.terminalModule);
  //This will redirect references to this module to the terminal
  module.exports.__proto__ = terminal;
  //Init the terminal
  return terminal.init.apply(terminal, arguments);
}

module.exports = {
  init: init
};
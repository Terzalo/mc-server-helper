//addons/mods.js
//This is Mods addon.
//It lets certain players execute a subset of op commands
'use strict';

var _mcConsole;
var _terminal;
var _commands = ["kick", "ban", "pardon"];
var _db;

function init(config, modules) {
  _mcConsole = modules.core.mcConsole;
  _terminal = modules.core.terminal;
  _db = modules.core.db.getDb();

  _db.run("CREATE TABLE IF NOT EXISTS 'mods' ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'mc_name' TEXT COLLATE NOCASE, 'permissions' TEXT);");

  //Skip initial console messages
  setTimeout(function(){
    _mcConsole.on('message', consoleMessageHandler);
  }, 10000);
}

function consoleMessageHandler( msg ) {
  var match = msg.match(/^<([A-Za-z0-9_]{3,16})> !(.*)$/);
  if (!match) return;
  var name = match[1];
  var command = match[2];

  var query = 'SELECT 1 FROM mods WHERE mc_name=? LIMIT 1;';
  _db.get( query, name, function(err, row) {
    if (err) {
      _terminal.error('DB error: ' + err.message);
      _terminal.error('Requested: ' + msg);
      return;
    }
    if (row) {
      _commands.some( cmd => {
        var pattern = new RegExp("^" + cmd + "\\b");
        if ( pattern.test(command) ) {
          _mcConsole.sendCommand( command );
        }
      });
    }
  });
}

module.exports = {
  init: init
};
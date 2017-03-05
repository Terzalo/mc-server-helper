//addons/activity.js
//This is activity tracker addon.
//It puts info about every player online into the database every 5 minutes
'use strict';

const cron = require('node-cron');

var _token;
var _terminal;
var _mcConsole;
var _db;
var _online; 

function init(config, modules) {
  _terminal = modules.core.terminal;
  _mcConsole = modules.core.mcConsole;

  _db = modules.core.db.getDb();
  _db.run("CREATE TABLE IF NOT EXISTS 'player_activity' ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'mc_name' TEXT COLLATE NOCASE, 'timestamp' TEXT DEFAULT ( strftime('%Y-%m-%d %H:%M', 'now') ));");

  cron.schedule('*/5 * * * *', logPlayers);
}

function logPlayers() {
  var query = "INSERT INTO 'player_activity' ('mc_name') VALUES ( ? )";
  _mcConsole.getOnline().forEach( function (mcName) {
    _db.run( query, mcName );
  });
}

module.exports = {
  init: init
};
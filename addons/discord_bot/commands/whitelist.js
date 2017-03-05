//addons/discord_bot/commands/whitelist.js
//This Discord bot command lets users to add themselves to the server's whitelist
'use strict';

var description = "`!whitelist YOUR_MINECRAFT_USERNAME` Add yourself to server's whitelist";
var _terminal;
var _mcConsole;
var _db;
var _discord;
var _serverAddress;

function init(config, modules, registerCallback) {
  _terminal = modules.core.terminal;
  _mcConsole = modules.core.mcConsole;
  _db = modules.core.db.getDb();
  _discord = modules.addons.discord_bot;
  _serverAddress = config.serverAddress;
  registerCallback( /^!whitelist\b/, processWhitelistRequest, description );
}

function processWhitelistRequest( message ) {
  var client = message.client;
  var mcName = message.content.split(' ');
  if (!mcName || mcName.length < 2) {
    message.reply('please provide your Minecraft username, e.g. `!whitelist Notch`');
    return;
  }
  mcName = mcName[1];
  if ( !/^[A-Za-z0-9_]{3,16}$/.test(mcName) ) {
    message.reply('***' + mcName + '*** is not a valid Minecraft username');
    return;
  }

  var dbId = null;

  var query = 'SELECT 1 FROM discord_users WHERE mc_name=? LIMIT 1;';
  _db.get( query, mcName, function(err, row) {
    if (err) {
      _terminal.error('DB error: ' + err.message);
      _terminal.error('Requested: ' + message.content);
      _terminal.error('From: ' + message.author.username);
      message.reply('an error occured. Sorry for that :(');
      return;
    }
    if (row) {
      message.reply('***' + mcName + '*** is already whitelisted!');
      return;
    }
    checkUser();
  });

  var checkUser = function(){
    var query = 'SELECT mc_name, id FROM discord_users WHERE discord_name=? LIMIT 1;';
    _db.get( query, message.author.id, function(err, row) {
      if (err) {
        _terminal.error('DB error: ' + err.message);
        _terminal.error('Requested: ' + message.content);
        _terminal.error('From: ' + message.author.username);
        message.reply('an error occured. Sorry for that :(');
        return;
      }
      if (row){
        var prevName = row.mc_name;
        dbId = row.id;
        message.reply('you are already whitelisted as ***' + prevName + '***');
        message.reply('type `confirm` to change your Minecraft username to ***' + mcName + '***');
        var replyHandler;
        client.on('message', replyHandler = reply => {
          if (reply.author !== message.author) return;
          client.removeListener('message', replyHandler);
          if (reply.content !== 'confirm') {
            message.reply('your username was not changed.');
            return;
          }
          _mcConsole.sendCommand('whitelist remove '+prevName);
          var msgHandler;
          _mcConsole.on('message', msgHandler = function( msg ){
            if (msg !== "Removed " + prevName + " from the whitelist" 
              && msg !== "Could not remove " + prevName + " from the whitelist" ) return;
            _mcConsole.removeListener('message', msgHandler);
            addWhitelist();
          });
        });
      } else {
        addWhitelist();
      }
    });
  }

  var addWhitelist = function(){
    _mcConsole.sendCommand('whitelist add ' + mcName);
    var msgHandler;
    _mcConsole.on('message', msgHandler = function( msg ){
      if (msg !== "Added " + mcName + " to the whitelist") return;
      _mcConsole.removeListener('message', msgHandler);
      message.reply('you are now whitelisted as ***' + mcName + '***!');
      if ( _serverAddress ) message.reply('server address is `' + _serverAddress + '`. Welcome!');
      var query = "INSERT OR REPLACE INTO 'discord_users' ('id','discord_name','mc_name') VALUES (?, ?, ?)";
      _db.run(query, [dbId, message.author.id, mcName]);
    });
  }
}

module.exports = {
  init: init
}
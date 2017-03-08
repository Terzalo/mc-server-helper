//addons/discord_bot/discord_bot.js
//The base module for the Discord bot addon
'use strict';

const discord = require('discord.js');
const client = new discord.Client();

var _token;
var _terminal;
var _mcConsole;
var _db;
var _online; 
var _commands;
var _allowedGuilds;

function init(config, modules) {
  _token = config.addons.discordBot.token;
  _terminal = modules.core.terminal;
  _mcConsole = modules.core.mcConsole;

  //Prepare the _allowedGuilds object
  processAllowedGuilds( config.addons.discordBot.allowedGuilds );

  _online = [];
  _commands = [];

  //Register all enabled commands
  config.addons.discordBot.commandsEnabled.forEach( function(cmd){
    var command = require('./commands/'+cmd);
    command.init(config, modules, registerCommand);
  });

  //Register "!help" command
  registerCommand( /^(!help|!commands)\b/, listCommands, "`!help` Display this list" )

  //This module keeps its own list of players online,
  //with associations to Discord users
  _mcConsole.on("onlineUpdated", updateOnline);

  _db = modules.core.db.getDb();
  _db.run("CREATE TABLE IF NOT EXISTS 'discord_users' ('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 'mc_name' TEXT COLLATE NOCASE, 'discord_name' TEXT);");

  client.on('message', handleMessage);
  client.on('disconnect', handleDisconnect);
  client.on('error', handleError);
  client.on('reconnecting', handleReconnecting);
  client.on('ready', handleReady);
  client.on('warn', handleWarn);

  client.login(_token);
}

function registerCommand( pattern, exec, description ) {
  _commands.push( { pattern: pattern, exec: exec, description: description } );
}

function handleError( error ) {
  _terminal.error("Discord error: " + error.message);
}

function handleDisconnect( event ) {
  _terminal.error("Discord disconnected " + event.code + " : " + event.reason);
}

function handleReconnecting() {
  _terminal.notify("Discord reconnecting");
}

function handleReady() {
  _terminal.notify("Discord ready");
}

function handleWarn( info ) {
  _terminal.notify("Discord warning : " + info);
}

function handleMessage( message ) {
  var guildId = message.channel.guild.id;
  var channel = message.channel.name;

  //Check if message came from an allowed guild and channel
  if ( _allowedGuilds && 
      ( !_allowedGuilds.hasOwnProperty(guildId) || 
        ( _allowedGuilds[ guildId ] && _allowedGuilds[guildId].length > 0 
          && _allowedGuilds[ guildId ].indexOf( channel ) === -1 ) ) ) {
    return;
  }

  var msg = message.content.toLowerCase();

  //Test the message against all commands
  _commands.some( cmd => {
    if ( cmd.pattern.test( msg ) ){
      cmd.exec( message );
    }
  });
}

function listCommands( message ) {
  var s = " you can use the following commands:\n\n";
  _commands.forEach(function(command){
    s += command.description + "\n";
  });
  message.reply(s);
}

function updateOnline( online ) {
  //Find who players are on Discord
  var queryPlaceholders = [];
  online.forEach( name => {
    queryPlaceholders.push("?");
  });
  queryPlaceholders = queryPlaceholders.join(", ");
  var query = "SELECT * FROM discord_users WHERE mc_name IN ( "+queryPlaceholders+" );";
  var dsIds = {};
  _db.each( query, online, function(err, row) {
    if (err) {
      _terminal.error('DB error: ' + err.message);
      return;
    };
    dsIds[row.mc_name.toLowerCase()] = row.discord_name;
  }, function(err, rows) {
    if (err) {
      _terminal.error('DB error: ' + err.message);
      return;
    };
    _online = [];
    online.forEach( function(mcName) {
      _online.push({
        mcName: mcName,
        discordId: dsIds[mcName.toLowerCase()]
      })
    });
  });
}

function getOnline( ) {
  return _online;
}

function processAllowedGuilds( guilds ) {
  _allowedGuilds = {};
  guilds.forEach(function(guild){
    _allowedGuilds[ guild.id ] = guild.channels;
  });
}

module.exports = {
  init: init,
  getOnline: getOnline
};
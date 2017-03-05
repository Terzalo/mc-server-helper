//addons/discord_bot/commands/who.js
//This Discord bot command lists players who are on the server
'use strict';

var description = "`!who` List players who are currently on the server";
var _terminal;
var _mcConsole;
var _db;
var _discord;

function init(config, modules, registerCallback) {
  _terminal = modules.core.terminal;
  _mcConsole = modules.core.mcConsole;
  _db = modules.core.db.getDb();
  _discord = modules.addons.discord_bot;
  registerCallback( /^(!who|!online)\b/, processOnlineRequest, description );
}

function processOnlineRequest( message ) {
  var client = message.client;
  var online = _discord.getOnline();
  if (online.length === 0) {
    message.reply(" there are no players on the server.");
    return;
  }
  var onlineMsg = [];
  var promises = [];
  online.forEach( function(user) {
    var s = "***"+user.mcName+"***";
    if (user.discordId){
      var dsUser = client.fetchUser(user.discordId);
      promises.push(dsUser);
      dsUser.then( function(val){
        var discordName = val.username;
        s += " (@" + discordName + ")";
        onlineMsg.push(s)
      })
    } else {
      onlineMsg.push(s);
    }
  });
  Promise.all(promises).then(function(vals){
    var firstLine;
    if (online.length > 1) {
      firstLine = " there are " + online.length + " players on the server:\n";
    } else {
      firstLine = " there is one player on the server:\n";
    }
    message.reply( firstLine + onlineMsg.join("\n") );
  });
}

module.exports = {
  init: init
}
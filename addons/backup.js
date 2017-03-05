//addons/backup.js
//This is backup addon. It uses node-cron to schedule backups
//The backup procedure itself (copying files) is handled by
//user-defined command that is run synchronically.
'use strict';

const cron = require('node-cron');
const childProcess = require('child_process');

var _token;
var _terminal;
var _mcConsole;
var _backupCmd;

function init(config, modules) {
  _backupCmd = config.addons.backup.backupCmd;
  _terminal = modules.core.terminal;
  _mcConsole = modules.core.mcConsole;

  cron.schedule(config.addons.backup.schedule, doBackup);
}

function doBackup() {
  _terminal.notify('Starting backup process...');
  _mcConsole.sendCommand('say Starting backup process');

  _terminal.notify('Saving the world');
  _mcConsole.sendCommand("save-all");

  var savedHandler = function( msg ){
    if (msg === "Saved the world") {
      _mcConsole.removeListener('message', savedHandler);

      //Stop the server from writing to world files while we are accessing them
      //WARNING: if the app fails after doing this, world saving won't be enabled back again!
      _terminal.notify('Disabling world saves');
      _mcConsole.sendCommand("save-off");
      var msgHandler;
      _mcConsole.on('message', saveDisabledHandler);
    }
  }

  var saveDisabledHandler = function( msg ){
    if(msg === "Saving is already turned off"
        || msg === "Turned off world auto-saving"){
      _mcConsole.removeListener('message', saveDisabledHandler);
      _terminal.notify('Fetching world files...');
      //Do the actual backup
      childProcess.execSync(_backupCmd,
        {stdio: "ignore"});
      _terminal.notify('Done. Enabling world saves');
      _mcConsole.sendCommand("save-on");
      _mcConsole.sendCommand("say Backup is complete!");
    }
  }

  _mcConsole.on('message', savedHandler);
}

module.exports = {
  init: init
};
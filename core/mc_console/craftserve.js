//core/mc_console/craftserve.js
//This is "craftserve" console engine.
//It connects to the craftserve.pl web console through a WebSocket
'use strict';

const WebSocket = require('ws');

var _url;
var _origin;
var _cookie;
var _terminal;
var _consoleBackend;
var _ws;

function init(config, modules, consoleBackend) {
  _url = config.mcConsole.url;
  _origin = config.mcConsole.origin;
  _cookie = config.mcConsole.cookie;
  _terminal = modules.core.terminal;
  _consoleBackend = consoleBackend;

  initWS();
}

function initWS(){
  //(re-)create the WebSocket connection
  _ws = new WebSocket( _url, {
    origin: _origin,
    headers: {
      "cookie": _cookie
    }
  });

  _ws.on('open', 
    () => { handleWSOpen() });

  _ws.on('close',  
    (code, reason) => { handleWSClose(code, reason); });

  _ws.on('error',
    (e) => { handleWSError(e); });

  _ws.on('unexpected-response',
    (request, response) => { handleWSUnexpected(request, response); });

  _ws.on('message',
    (data, flags) => { handleWSMessage(data, flags); });
}

function handleWSOpen() {
  _terminal.notify("WS opened");
  //Subsribe to the updates we need
  _ws.send('{"scope":"console","op":"subscribe_console","args":{"debug":false}}');
  _ws.send('{"scope":"players","op":"subscribe_online"}');
}

function handleWSClose(code, reason) {
  _terminal.error("WS closed: " + reason);

  //Try to connect again
  setTimeout(() => { initWS() }, 3000);
}

function handleWSError(e) {
  _terminal.error("WS error: " + e.message);
}

function handleWSUnexpected(request, response) {
  _terminal.error("Unexpected response");
  _terminal.error(response.rawHeaders);
}

function handleWSMessage(data, flags) {
  data = JSON.parse(data);
  if (!data) return;
  if (data.scope === "console" && data.stream) {
    data.stream.forEach(function(msg){
      _consoleBackend.receiveLine( msg );
    });
  }else if (data.scope === "players" && data.online) {
    _consoleBackend.setOnline( data.online );
  }else{
    _terminal.notify("WS: Unhandled message received");
    _terminal.notify(JSON.stringify(data));
  }
}

function sendCommand( command ) {
  _ws.send(JSON.stringify({scope: 'console', op: 'execute', args: {command: command}}));
}

module.exports = {
  init: init,
  sendCommand: sendCommand
};
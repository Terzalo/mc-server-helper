//helper.js
//This is the main module of the app. It loads and initializes other modules
'use strict'

//Load app configuration
const config = require('./config');

//Load core modules
const mcConsole = require("./core/mc_console");
const terminal = require("./core/terminal");
const db = require("./core/db");

//This object will be used for dependency injection
//it's passed to a module on initialization
//to allow access to other modules
var modules = {
  core: {
    mcConsole: mcConsole,
    terminal: terminal,
    db: db
  },
  addons: {}
}

//Init core modules
terminal.init(config, modules);
mcConsole.init(config, modules);
db.init(config);

//Load addons
const addons = require("./addons").loadAddons(config, modules);

modules.addons = addons;

//Init addons
for (var key in addons){
  addons[key].init(config, modules);
}
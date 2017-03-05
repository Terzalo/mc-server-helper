//config/index.js
//This module collects configs for different modules together
'use strict'

const common = require('./common')  
const mcConsole = require('./core/mc_console/'+common.mcConsoleModule);
const db = require('./core/db');
const addons = require('./addons').loadConfig(common.addonsEnabled);

module.exports = Object.assign({}, common, mcConsole, db, addons) 
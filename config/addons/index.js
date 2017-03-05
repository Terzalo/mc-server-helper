//config/addons/index.js
//This module collects configs for different addons together
'use strict'

function loadConfig( addonNames ) {
  var addonConfigs = [];
  addonNames.forEach( addon => { addonConfigs.push(require('./'+addon)) } );
  var config = {
    addons: Object.assign.apply(Object, [{}].concat( addonConfigs ))
  };
  return config;
}

module.exports.loadConfig = loadConfig;
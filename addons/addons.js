//addons/addons.js
//This module loads (but does not init) selected addons
'use strict';

function loadAddons( config ) {
  var args = arguments;
  var addons = {};
  config.addonsEnabled.forEach( addonName => {
    var addon = require('./'+addonName);
    addons[addonName] = addon;
  });
  return addons;
}

module.exports = {
  loadAddons: loadAddons
}
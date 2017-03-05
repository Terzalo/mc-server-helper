//core/db.js
//This is a core module that handles the connection to sqlite database.
'use strict';

const sqlite3 = require('sqlite3');

var db;

var _dbName;

function init(config) {
  //Connect to the database
  _dbName = config.db.dbName;
  var dbFile = __dirname + '/../db/' + _dbName;
  db = new sqlite3.Database(dbFile);
}

function getDb() {
  //Return the database object
  return db;
}

module.exports = {
  init: init,
  getDb: getDb
};
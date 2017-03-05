//config/core/db.js
//Database configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({  
  DB_NAME: joi.string()
    .default("helper.sqlite")
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  db: {
    dbName: envVars.DB_NAME
  }
}

module.exports = config
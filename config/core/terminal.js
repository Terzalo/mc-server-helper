//config/core/terminal.js
//Terminal configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({  
  ERR_LEVEL: joi.number().integer().min(0).max(2)
    .default(2)
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {
  terminal: {
    errLevel: envVars.ERR_LEVEL
  }
}

module.exports = config
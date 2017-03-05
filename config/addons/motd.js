//config/addons/motd.js
//Message of the Day addon configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  MOTD: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  motd: {
    message: envVars.MOTD
  }
}

module.exports = config
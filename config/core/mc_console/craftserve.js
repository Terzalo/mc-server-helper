//config/core/mc_console/craftserve.js
//"craftserve" console engine configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  MC_CRAFTSERVE_URL: joi.string()
    .required(),
  MC_CRAFTSERVE_ORIGIN: joi.string()
    .default("https://craftserve.com"),
  MC_CRAFTSERVE_COOKIE: joi.string()
    .required()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  mcConsole: {
    url: envVars.MC_CRAFTSERVE_URL,
    origin: envVars.MC_CRAFTSERVE_ORIGIN,
    cookie: envVars.MC_CRAFTSERVE_COOKIE
  }
}

module.exports = config
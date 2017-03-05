//config/common.js
//Configuration options that are not bound to any module
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({  
  MC_CONSOLE: joi.string()
    .allow(['local', 'craftserve'])
    .required(),
  TERMINAL: joi.string()
    .allow(['color'])
    .default('color'),
  ADDONS: joi.array()
    .items(joi.string()
      .allow(['discord_bot', 'backup', 'activity'])
      .required())
    .single()
    .required(),
  SERVER_ADDRESS: joi.string()
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  mcConsoleModule: envVars.MC_CONSOLE,
  terminalModule: envVars.TERMINAL,
  addonsEnabled: envVars.ADDONS,
  serverAddress: envVars.SERVER_ADDRESS
}

module.exports = config  
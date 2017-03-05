//config/addons/backup.js
//Backup addon configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  BACKUP_CMD: joi.string()
    .required(),
  BACKUP_SCHEDULE: joi.string()
    .default('0 0 * * *')
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  backup: {
    backupCmd: envVars.BACKUP_CMD,
    schedule: envVars.BACKUP_SCHEDULE
  }
}

module.exports = config
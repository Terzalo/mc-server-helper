//config/addons/discord_bot.js
//Discord bot addon configuration
'use strict'

const joi = require('joi')

const envVarsSchema = joi.object({
  DISCORD_TOKEN: joi.string()
    .required(),
  DISCORD_COMMANDS: joi.array()
    .items(joi.string()
      .allow(['whitelist', 'who'])
      .required())
    .single()
    .default(['whitelist', 'who']),
  DISCORD_GUILDS: joi.array()
    .items(joi.object({
      id: joi.string().required(),
      channels: joi.array().items(joi.string())
    }))
}).unknown()
  .required()

const { error, value: envVars } = joi.validate(process.env, envVarsSchema)  
if (error) {  
  throw new Error(`Config validation error: ${error.message}`)
}

const config = {  
  discordBot: {
    token: envVars.DISCORD_TOKEN,
    commandsEnabled: envVars.DISCORD_COMMANDS,
    allowedGuilds: envVars.DISCORD_GUILDS
  }
}

module.exports = config
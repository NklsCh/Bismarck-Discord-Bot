require('dotenv').config()
const fs = require('fs')
const {
    Client,
    Collection,
    GatewayIntentBits: {
        GuildMembers,
        GuildMessageReactions,
        GuildMessages,
        GuildPresences,
        Guilds,
        MessageContent,
    },
} = require('discord.js')

/*
    Initiates the Bot as client
*/
const client = new Client({
    intents: [
        GuildMembers,
        GuildPresences,
        Guilds,
        GuildMessages,
        GuildMessageReactions,
        MessageContent,
    ],
})

process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (err) => {
    console.log('Uncaught Exception:', err)
})

process.on('uncaughtExceptionMonitor', (err, origin) => {
    console.log('Uncaught Exepction Monitor:', err, origin)
})

client.commands = new Collection()

// Load Handlers

for (const file of fs
    .readdirSync('./src/handlers')
    .filter((file) => file.endsWith('.js'))) {
    require(`./handlers/${file}`)(client)
}

client
    .login(process.env.TOKEN)
    .then((r) => console.log(`Ready! Logged in as ${client.user.tag}`))

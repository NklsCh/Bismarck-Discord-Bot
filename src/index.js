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
const modules = ['admin', 'user', 'other']

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

client.commands = new Collection()

// Command handler

modules.forEach((module) => {
    const commandFiles = fs
        .readdirSync(`./src/commands/${module}/`)
        .filter((file) => file.endsWith('.js'))

    commandFiles.forEach((commandFile) => {
        const command = require(`./commands/${module}/${commandFile}`)
        client.commands.set(command.data.name, command)
    })
})

// Event handler

const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'))

eventFiles.forEach((file) => {
    const event = require(`./../events/${file}`)
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args))
    } else {
        client.on(event.name, (...args) => event.execute(...args))
    }
})

client
    .login(process.env.TOKEN)
    .then((r) => console.log(`Ready! Logged in as ${client.user.tag}`))

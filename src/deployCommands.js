require('dotenv').config()
const fs = require('fs')
const { REST, Routes } = require('discord.js')
const commands = []

const commandFiles = fs
    .readdirSync('./src/commands')
    .filter((file) => file.endsWith('.js'))

commandFiles.forEach((commandFile) => {
    const command = require(`./commands/${commandFile}`)
    commands.push(command.data.toJSON())
})

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

;(async () => {
    try {
        console.log(
            `Started refreshing ${commands.length} application (/) commands.`
        )

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID),
            { body: commands }
        )

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`
        )
    } catch (error) {
        console.error(error)
    }
})()

/*rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID),
    {body: commands})
    .then(() => console.log("Successfully registered application commands."))
    .catch(console.error)*/

//Delete a specific command by its ID

/* rest.delete(Routes.applicationCommand(process.env.DISCORD_APPLICATION_ID, ''))
	.then(() => console.log('Successfully deleted application command'))
	.catch(console.error); */

//Delete all commands

/* rest.put(Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID, process.env.DISCORD_GUILD_ID), { body: [] })
.then(() => console.log('Successfully deleted all application commands.'))
.catch(console.error); */

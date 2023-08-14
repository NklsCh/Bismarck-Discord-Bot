const fs = require('fs')

module.exports = (client) => {
    const commandFolders = fs.readdirSync('./src/commands')

    commandFolders.forEach((folder) => {
        const commandFiles = fs
            .readdirSync(`./src/commands/${folder}`)
            .filter((file) => file.endsWith('.js'))

        commandFiles.forEach((commandFile) => {
            const command = require(`../commands/${folder}/${commandFile}`)
            client.commands.set(command.data.name, command)
        })
    })

    console.log('Commands loaded!')
}
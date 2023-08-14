const fs = require('fs')

module.exports = (client) => {
    const eventFiles = fs
        .readdirSync('./events')
        .filter((file) => file.endsWith('.js'))

    eventFiles.forEach((file) => {
        const event = require(`../../events/${file}`)
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args))
        } else {
            client.on(event.name, (...args) => event.execute(...args))
        }
    })

    console.log('Events loaded!')
}
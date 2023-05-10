const {
    ActivityType: { Watching },
    Events,
} = require('discord.js')
const Guild = require('../models/guilds')
const cMessage = require('../models/cMessage')

module.exports = {
    name: Events.GuildDelete,
    async execute(guild) {
        let client = guild.client

        const serverAmount = client.guilds.cache

        await cMessage.destroy({
            where: {
                guildId: guild.id,
            },
        })
        await Guild.destroy({
            where: {
                guildId: guild.id,
            },
        })

        client.user.setPresence({
            activities: [
                {
                    name: `${serverAmount.size} Server(s)`,
                    type: Watching,
                },
            ],
            status: 'online',
        })
    },
}

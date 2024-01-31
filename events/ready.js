const {
    ActivityType: { Watching },
} = require('discord.js')
const Guild = require('../models/guilds')
const cMessage = require('../models/cMessage')

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        let memberAmount = 0

        await Guild.sync()
        await cMessage.sync()

        client.guilds.fetch({ cache: true })

        //Get the amount of all users from all servers
        client.guilds.cache.forEach((guild) => {
            memberAmount += guild.members.cache.filter(
                (member) => !member.user.bot
            ).size
        })

        client.guilds.cache.forEach(async (guild) => {
            await Guild.findOrCreate({
                where: {
                    guildId: guild.id,
                },
            })

            await cMessage.findOrCreate({
                where: {
                    guildId: guild.id,
                },
            })
        })

        const serverAmount = client.guilds.cache

        client.user.setPresence({
            activities: [
                {
                    name: `${new Intl.NumberFormat('de-DE').format(
                        memberAmount
                    )} users in ${serverAmount.size} server(s)`,
                    type: Watching,
                },
            ],
            status: 'online',
        })

        //Get the config file for the server and change the channel name to the amount of users in the server

        setInterval(() => {
            client.guilds.cache.forEach(async (guild) => {
                const [dbguild] = await Guild.findOrCreate({
                    where: {
                        guildId: guild.id,
                    },
                })
                //Get all online users from guild
                await guild.members.fetch({ cache: true })
                let onlineUsers = guild.members.cache.filter(
                    (member) =>
                        (member.presence?.status === 'online' ||
                            member.presence?.status === 'idle' ||
                            member.presence?.status === 'dnd') &&
                        !member.user.bot
                ).size
                if (await dbguild.onlineChannelId) {
                    await guild.channels.edit(await dbguild.onlineChannelId, {
                        name: `Online: ${onlineUsers}`,
                    })
                }
                if (await dbguild.allChannelId) {
                    await guild.channels.edit(await dbguild.allChannelId, {
                        name: `Members: ${guild.memberCount}`,
                    })
                }
                if (await dbguild.botChannelId) {
                    await guild.channels.edit(await dbguild.botChannelId, {
                        name: `Bots: ${guild.members.cache.filter(
                            (member) => member.user.bot
                        ).size
                            }`,
                    })
                }
            })
        }, 1000 * 350)
    },
}

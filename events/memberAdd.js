const { Events } = require('discord.js')
const Guilds = require('../models/guilds')
const cMessage = require('../models/cMessage')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client) {
        const name = client.guild.name
        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: client.guild.id,
            },
        })
        const [customMessage] = await cMessage.findOrCreate({
            where: {
                guildId: client.guild.id,
            },
        })

        if (await customMessage.welcomeMessage) {
            const welcomeEmbed = {
                color: 0x0099ff,
                title: '**Welcome**',
                thumbnail: {
                    url: client.user.avatarURL(),
                },
                description: await customMessage.welcomeMessage,
            }
            if (!(await dbguild.welcomeChannelId)) return
            client.guild.channels
                .fetch(await dbguild.welcomeChannelId)
                .then((channel) => {
                    channel.send({ embeds: [welcomeEmbed] })
                })
        } else {
            const helloEmbed = {
                color: 0x0099ff,
                title: '**Welcome**',
                thumbnail: {
                    url: client.user.avatarURL(),
                },
                description: 'Welcome ' + client.user.tag + ' to ' + name + '!',
            }
            if (!(await dbguild.welcomeChannelId)) return
            client.guild.channels
                .fetch(await dbguild.welcomeChannelId)
                .then((channel) => {
                    channel.send({ embeds: [helloEmbed] })
                })
        }
    },
}

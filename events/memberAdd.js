const { Events } = require('discord.js')
const Guilds = require('../models/guilds')
const cMessage = require('../models/cMessage')

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(GuildMember) {
        const name = GuildMember.guild.name;
        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: GuildMember.guild.id,
            },
        });
        const [customMessage] = await cMessage.findOrCreate({
            where: {
                guildId: GuildMember.guild.id,
            },
        });

        if (await customMessage.welcomeMessage) {
            const welcomeEmbed = {
                color: 0x0099ff,
                title: "**Welcome**",
                thumbnail: {
                    url: GuildMember.user.avatarURL(),
                },
                description: await customMessage.welcomeMessage,
            };
            if (!(await dbguild.welcomeChannelId)) return;
            GuildMember.guild.channels
                .fetch(await dbguild.welcomeChannelId)
                .then((channel) => {
                    channel.send({ embeds: [welcomeEmbed] });
                });
        } else {
            const helloEmbed = {
                color: 0x0099ff,
                title: "**Welcome**",
                thumbnail: {
                    url: GuildMember.user.avatarURL(),
                },
                description:
                    "Welcome " + GuildMember.user.tag + " to " + name + "!",
            };
            if (!(await dbguild.welcomeChannelId)) return;
            GuildMember.guild.channels
                .fetch(await dbguild.welcomeChannelId)
                .then((channel) => {
                    channel.send({ embeds: [helloEmbed] });
                });
        }
    },
};

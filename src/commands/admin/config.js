const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js')
const Guilds = require('../../../models/guilds')
const cMessage = require('../../../models/cMessage')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription('Shows the current configuration of the bot')
        .setDescriptionLocalizations({
            de: 'Zeigt die aktuelle Konfiguration des Bots an',
        })
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const [dbguild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        })
        const [customMessage] = await cMessage.findOrCreate({
            where: { guildId: interaction.guild.id },
        })
        await interaction.deferReply({ ephemeral: true })
        const trackEmbed = new EmbedBuilder()
            .setTitle('Tracking Channels')
            .setFields([
                {
                    name: 'Online',
                    value: `${
                        (await dbguild.onlineChannelId)
                            ? await interaction.guild.channels.fetch(
                                  await dbguild.onlineChannelId
                              )
                            : 'Not tracking'
                    }`,
                    inline: true,
                },
                {
                    name: 'All',
                    value: `${
                        (await dbguild.allChannelId)
                            ? await interaction.guild.channels.fetch(
                                  await dbguild.allChannelId
                              )
                            : 'Not tracking'
                    }`,
                    inline: true,
                },
                {
                    name: 'Bots',
                    value: `${
                        (await dbguild.botChannelId)
                            ? await interaction.guild.channels.fetch(
                                  await dbguild.botChannelId
                              )
                            : 'Not tracking'
                    }`,
                    inline: true,
                },
            ])
        const channelEmbed = new EmbedBuilder()
            .setTitle('Custom Messages')
            .setFields([
                {
                    name: 'Welcome',
                    value: `${
                        (await dbguild.welcomeChannelId)
                            ? await interaction.guild.channels.fetch(
                                  await dbguild.welcomeChannelId
                              )
                            : 'Not welcoming'
                    }`,
                    inline: true,
                },
                {
                    name: 'Leave',
                    value: `${
                        (await dbguild.leaveChannelId)
                            ? await interaction.guild.channels.fetch(
                                  await dbguild.leaveChannelId
                              )
                            : 'Not saying goodbye'
                    }`,
                    inline: true,
                },
                {
                    name: ' ',
                    value: ' ',
                    inline: true,
                },
                {
                    name: 'Welcome message',
                    value:
                        '```' +
                        `${
                            (await customMessage.welcomeMessage)
                                ? await customMessage.welcomeMessage
                                : 'Welcome $user to $server!'
                        }` +
                        '```',
                    inline: true,
                },
                {
                    name: 'Goodbye message',
                    value:
                        '```' +
                        `${
                            (await customMessage.goodbyeMessage)
                                ? await customMessage.goodbyeMessage
                                : '$User left the server!'
                        }` +
                        '```',
                    inline: true,
                },
            ])

        interaction.editReply({ embeds: [trackEmbed, channelEmbed] })
    },
}

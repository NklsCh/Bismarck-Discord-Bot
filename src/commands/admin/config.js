const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    EmbedBuilder,
    CommandInteraction
} = require('discord.js')
const Guilds = require('../../../models/guilds')
const cMessage = require('../../../models/cMessage')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription(langData.en.config.commandDesciption)
        .setDescriptionLocalizations({
            de: langData.de.config.commandDesciption,
        })
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    /**
     * @param {CommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const [dbguild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        })
        const [customMessage] = await cMessage.findOrCreate({
            where: { guildId: interaction.guild.id },
        })
        await interaction.deferReply({ ephemeral: true })
        const trackEmbed = new EmbedBuilder()
            .setTitle(langData[userLang].config.trackEmbed.title)
            .setFields([
                {
                    name: langData[userLang].config.trackEmbed.fields[0].name,
                    value: `${(await dbguild.onlineChannelId)
                        ? await interaction.guild.channels.fetch(
                            await dbguild.onlineChannelId
                        )
                        : langData[userLang].config.trackEmbed.fields[0]
                            .value
                        }`,
                    inline: true,
                },
                {
                    name: langData[userLang].config.trackEmbed.fields[1].name,
                    value: `${(await dbguild.allChannelId)
                        ? await interaction.guild.channels.fetch(
                            await dbguild.allChannelId
                        )
                        : langData[userLang].config.trackEmbed.fields[1]
                            .value
                        }`,
                    inline: true,
                },
                {
                    name: langData[userLang].config.trackEmbed.fields[2].name,
                    value: `${(await dbguild.botChannelId)
                        ? await interaction.guild.channels.fetch(
                            await dbguild.botChannelId
                        )
                        : langData[userLang].config.trackEmbed.fields[2]
                            .value
                        }`,
                    inline: true,
                },
            ])
        const channelEmbed = new EmbedBuilder()
            .setTitle(langData[userLang].config.channelEmbed.title)
            .setFields([
                {
                    name: langData[userLang].config.channelEmbed.fields[0].name,
                    value: `${(await dbguild.welcomeChannelId)
                        ? await interaction.guild.channels.fetch(
                            await dbguild.welcomeChannelId
                        )
                        : langData[userLang].config.channelEmbed.fields[0]
                            .value
                        }`,
                    inline: true,
                },
                {
                    name: langData[userLang].config.channelEmbed.fields[1].name,
                    value: `${(await dbguild.leaveChannelId)
                        ? await interaction.guild.channels.fetch(
                            await dbguild.leaveChannelId
                        )
                        : langData[userLang].config.channelEmbed.fields[1]
                            .value
                        }`,
                    inline: true,
                },
                {
                    name: ' ',
                    value: ' ',
                    inline: true,
                },
                {
                    name: langData[userLang].config.channelEmbed.fields[2].name,
                    value:
                        '```' +
                        `${(await customMessage.welcomeMessage)
                            ? await customMessage.welcomeMessage
                            : langData[userLang].config.channelEmbed.fields[2].value
                        }` +
                        '```',
                    inline: true,
                },
                {
                    name: langData[userLang].config.channelEmbed.fields[3].name,
                    value:
                        '```' +
                        `${(await customMessage.goodbyeMessage)
                            ? await customMessage.goodbyeMessage
                            : langData[userLang].config.channelEmbed.fields[3].value
                        }` +
                        '```',
                    inline: true,
                },
            ])

        await interaction.editReply({ embeds: [trackEmbed, channelEmbed] })
    },
}

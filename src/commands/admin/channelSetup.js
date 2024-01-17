const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChannelType: { GuildText },
} = require('discord.js')
const Guilds = require('../../../models/guilds')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName(langData.en.channelSetup.command.name)
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('set')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('join')
                        .setDescription(
                            langData.en.channelSetup.command.subCommandJoin
                                .description
                        )
                        .setDescriptionLocalizations({
                            de: langData.de.channelSetup.command.subCommandJoin
                                .description,
                        })
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription(
                                    langData.en.channelSetup.command
                                        .subCommandJoin.channelOptionDescription
                                )
                                .setDescriptionLocalizations({
                                    de: langData.de.channelSetup.command
                                        .subCommandJoin
                                        .channelOptionDescription,
                                })
                                .setRequired(true)
                                .addChannelTypes(GuildText)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('leave')
                        .setDescription(
                            langData.en.channelSetup.command.subCommandLeave
                                .description
                        )
                        .setDescriptionLocalizations({
                            de: langData.de.channelSetup.command.subCommandLeave
                                .description,
                        })
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription(
                                    langData.en.channelSetup.command
                                        .subCommandLeave
                                        .channelOptionDescription
                                )
                                .setDescriptionLocalizations({
                                    de: langData.de.channelSetup.command
                                        .subCommandLeave
                                        .channelOptionDescription,
                                })
                                .setRequired(true)
                                .addChannelTypes(GuildText)
                        )
                )
        )
        .addSubcommandGroup((subcommandGroup) =>
            subcommandGroup
                .setName('unset')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('join')
                        .setDescription(
                            langData.en.channelSetup.command
                                .subCommandUnsetJoinDescription
                        )
                        .setDescriptionLocalizations({
                            de: langData.de.channelSetup.command
                                .subCommandUnsetJoinDescription,
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('leave')
                        .setDescription(
                            langData.en.channelSetup.command
                                .subCommandUnsetLeaveDescription
                        )
                        .setDescriptionLocalizations({
                            de: langData.de.channelSetup.command
                                .subCommandUnsetLeaveDescription,
                        })
                )
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        //Get server config
        const [guild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        })

        //Switch the subcommand group whether it is set or unset
        switch (interaction.options.getSubcommandGroup()) {
            case 'unset':
                //Switch the subcommand whether it is join or leave
                switch (interaction.options.getSubcommand()) {
                    case 'join':
                        //Set the join channel to null and save the config
                        await guild.update({
                            welcomeChannelId: null,
                        })
                        interaction.reply({
                            content:
                                langData[userLang].channelSetup.reply
                                    .joinChannelUnset,
                            ephemeral: true,
                        })
                        break
                    case 'leave':
                        //Set the leave channel to null and save the config
                        await guild.update({
                            goodbyeChannelId: null,
                        })
                        interaction.reply({
                            content:
                                langData[userLang].channelSetup.reply
                                    .leaveChannelUnset,
                            ephemeral: true,
                        })
                        break
                }
                break
            case 'set':
                switch (interaction.options.getSubcommand()) {
                    case 'join':
                        const welcomeChannelId =
                            interaction.options.getChannel('channel')

                        await guild.update({
                            welcomeChannelId: welcomeChannelId.id,
                        })
                        interaction.reply({
                            content:
                                langData[userLang].channelSetup.reply
                                    .joinChannelSet + `${welcomeChannelId}`,
                            ephemeral: true,
                        })
                        break
                    case 'leave':
                        const goodbyeChannelId =
                            interaction.options.getChannel('channel')

                        await guild.update({
                            goodbyeChannelId: goodbyeChannelId.id,
                        })

                        interaction.reply({
                            content:
                                langData[userLang].channelSetup.reply
                                    .leaveChannelSet + `${goodbyeChannelId}`,
                            ephemeral: true,
                        })
                        break
                }
                break
        }
    },
}

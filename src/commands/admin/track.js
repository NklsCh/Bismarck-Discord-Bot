const {
    PermissionFlagsBits: { Administrator },
    EmbedBuilder,
    SlashCommandBuilder,
} = require('discord.js')
const Guilds = require('../../../models/guilds')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('track')
        .setDescription(
            'Configures the bot to track the amount of users in a server'
        )
        .setDescriptionLocalizations({
            de: 'Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen',
        })
        .addSubcommandGroup((group) =>
            group
                .setName('add')
                .setDescription(
                    'Configures the bot to track the amount of users in a server'
                )
                .setDescriptionLocalizations({
                    de: 'Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen',
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('online')
                        .setDescription(
                            'Configures the bot to track the amount of online users in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Konfiguriert den Bot, um die Anzahl der Benutzer in einem Server zu verfolgen, welche online sind',
                        })
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription(
                                    'The channel to track the amount of users in'
                                )
                                .setDescriptionLocalizations({
                                    de: 'Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll',
                                })
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('all')
                        .setDescription(
                            'Configures the bot to track the amount of all users in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Konfiguriert den Bot, um die Anzahl aller Benutzer in einem Server zu verfolgen',
                        })
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription(
                                    'The channel to track the amount of users in'
                                )
                                .setDescriptionLocalizations({
                                    de: 'Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll',
                                })
                                .setRequired(true)
                        )
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bots')
                        .setDescription(
                            'Configures the bot to track the amount of bots in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Konfiguriert den Bot, um die Anzahl der Bots in einem Server zu verfolgen',
                        })
                        .addChannelOption((option) =>
                            option
                                .setName('channel')
                                .setDescription(
                                    'The channel to track the amount of users in'
                                )
                                .setDescriptionLocalizations({
                                    de: 'Der Kanal, in dem die Anzahl der Benutzer verfolgt werden soll',
                                })
                                .setRequired(true)
                        )
                )
        )
        .addSubcommandGroup((group) =>
            group
                .setName('remove')
                .setDescription(
                    'Removes the tracking of the amount of users in a server'
                )
                .setDescriptionLocalizations({
                    de: 'Entfernt die Verfolgung der Anzahl der Benutzer in einem Server',
                })
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('online')
                        .setDescription(
                            'Removes the tracking of the amount of online users in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Entfernt die Verfolgung der Anzahl der Benutzer in einem Server welche online sind',
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('all')
                        .setDescription(
                            'Removes the tracking of the amount of all users in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Entfernt die Verfolgung der Anzahl aller Benutzer in einem Server',
                        })
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('bots')
                        .setDescription(
                            'Removes the tracking of the amount of bots in a server'
                        )
                        .setDescriptionLocalizations({
                            de: 'Entfernt die Verfolgung der Anzahl der Bots in einem Server',
                        })
                )
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const [guild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        })
        const channel = interaction.options.getChannel('channel')
        switch (
            interaction.options.getSubcommandGroup() ||
            interaction.options.getSubcommand()
        ) {
            case 'add':
                switch (interaction.options.getSubcommand()) {
                    case 'online':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            onlineChannelId: channel.id,
                        })
                        await interaction.editReply({
                            content: `The bot will now track the amount of online users in ${channel}!`,
                        })
                        break
                    case 'all':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            allChannelId: channel.id,
                        })
                        await interaction.editReply({
                            content: `The bot will now track the amount of all users in ${channel}!`,
                            ephemeral: true,
                        })
                        break
                    case 'bots':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            botChannelId: channel.id,
                        })
                        await interaction.editReply({
                            content: `The bot will now track the amount of bots in ${channel}!`,
                            ephemeral: true,
                        })
                }
                break
            case 'remove':
                switch (interaction.options.getSubcommand()) {
                    case 'online':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            onlineChannelId: null,
                        })
                        await interaction.editReply({
                            content:
                                'The bot will no longer track the amount of online users!',
                            ephemeral: true,
                        })
                        break
                    case 'all':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            allChannelId: null,
                        })
                        await interaction.editReply({
                            content:
                                'The bot will no longer track the amount of all users!',
                            ephemeral: true,
                        })
                        break
                    case 'bots':
                        await interaction.deferReply({ ephemeral: true })
                        await guild.update({
                            botChannelId: null,
                        })
                        await interaction.editReply({
                            content:
                                'The bot will no longer track the amount of bots!',
                            ephemeral: true,
                        })
                        break
                }
                break
        }
    },
}

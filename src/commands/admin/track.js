const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require( 'discord.js' )
const Guilds = require( '../../../models/guilds' )

const langData = require( `../../../resources/translations/lang.json` )

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'track' )
        .setDescription( '-' )
        .addSubcommandGroup( ( group ) =>
            group
                .setName( 'add' )
                .setDescription( '-' )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'online' )
                        .setDescription(
                            langData.en.track.command.addOnlineDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command.addOnlineDescription,
                        } )
                        .addChannelOption( ( option ) =>
                            option
                                .setName( 'channel' )
                                .setDescription(
                                    langData.en.track.command
                                        .channelOptionDesciption
                                )
                                .setDescriptionLocalizations( {
                                    de: langData.de.track.command
                                        .channelOptionDesciption,
                                } )
                                .setRequired( true )
                        )
                )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'all' )
                        .setDescription(
                            langData.en.track.command.addAllDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command.addAllDescription,
                        } )
                        .addChannelOption( ( option ) =>
                            option
                                .setName( 'channel' )
                                .setDescription(
                                    langData.en.track.command
                                        .channelOptionDesciption
                                )
                                .setDescriptionLocalizations( {
                                    de: langData.de.track.command
                                        .channelOptionDesciption,
                                } )
                                .setRequired( true )
                        )
                )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'bots' )
                        .setDescription(
                            langData.en.track.command.addBotsDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command.addBotsDescription,
                        } )
                        .addChannelOption( ( option ) =>
                            option
                                .setName( 'channel' )
                                .setDescription(
                                    langData.en.track.command
                                        .channelOptionDesciption
                                )
                                .setDescriptionLocalizations( {
                                    de: langData.de.track.command
                                        .channelOptionDesciption,
                                } )
                                .setRequired( true )
                        )
                )
        )
        .addSubcommandGroup( ( group ) =>
            group
                .setName( 'remove' )
                .setDescription( '-' )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'online' )
                        .setDescription(
                            langData.en.track.command.removeOnlineDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command
                                .removeOnlineDescription,
                        } )
                )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'all' )
                        .setDescription(
                            langData.en.track.command.removeAllDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command.removeAllDescription,
                        } )
                )
                .addSubcommand( ( subcommand ) =>
                    subcommand
                        .setName( 'bots' )
                        .setDescription(
                            langData.en.track.command.removeBotsDescription
                        )
                        .setDescriptionLocalizations( {
                            de: langData.de.track.command.removeBotsDescription,
                        } )
                )
        )
        .setDefaultMemberPermissions( Administrator )
        .setDMPermission( false ),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute( interaction ) {
        const [ guild ] = await Guilds.findOrCreate( {
            where: { guildId: interaction.guild.id },
        } )
        const channel = interaction.options.getChannel( 'channel' )
        switch (
        interaction.options.getSubcommandGroup() ||
        interaction.options.getSubcommand()
        ) {
            case 'add':
                switch ( interaction.options.getSubcommand() ) {
                    case 'online':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            onlineChannelId: channel.id,
                        } )
                        await interaction.editReply( {
                            content: `The bot will now track the amount of online users in ${ channel }!`,
                        } )
                        break
                    case 'all':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            allChannelId: channel.id,
                        } )
                        await interaction.editReply( {
                            content: `The bot will now track the amount of all users in ${ channel }!`,
                            ephemeral: true,
                        } )
                        break
                    case 'bots':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            botChannelId: channel.id,
                        } )
                        await interaction.editReply( {
                            content: `The bot will now track the amount of bots in ${ channel }!`,
                            ephemeral: true,
                        } )
                }
                break
            case 'remove':
                switch ( interaction.options.getSubcommand() ) {
                    case 'online':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            onlineChannelId: null,
                        } )
                        await interaction.editReply( {
                            content:
                                'The bot will no longer track the amount of online users!',
                            ephemeral: true,
                        } )
                        break
                    case 'all':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            allChannelId: null,
                        } )
                        await interaction.editReply( {
                            content:
                                'The bot will no longer track the amount of all users!',
                            ephemeral: true,
                        } )
                        break
                    case 'bots':
                        await interaction.deferReply( { ephemeral: true } )
                        await guild.update( {
                            botChannelId: null,
                        } )
                        await interaction.editReply( {
                            content:
                                'The bot will no longer track the amount of bots!',
                            ephemeral: true,
                        } )
                        break
                }
                break
        }
    },
}

const {
    ChatInputCommandInteraction,
    EmbedBuilder,
    InteractionContextType,
    PermissionsBitField,
    SlashCommandBuilder,
} = require( 'discord.js' )
const wait = require( 'node:timers/promises' ).setTimeout
const warns = require( '../../../models/warns' )

const langData = require( `../../../resources/translations/lang.json` )

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'warn' )
        .setDescription( langData.en.warn.command.description )
        .setDescriptionLocalizations( {
            de: langData.de.warn.command.description
        } )
        .addUserOption( ( option ) =>
            option
                .setName( 'user' )
                .setDescription( langData.en.warn.command.userOptionDescription )
                .setDescriptionLocalizations( {
                    de: langData.de.warn.command.userOptionDescription
                } )
                .setRequired( true )
        )
        .addStringOption( ( option ) =>
            option
                .setName( 'reason' )
                .setDescription( langData.en.warn.command.stringOptionDescription )
                .setDescriptionLocalizations( {
                    de: langData.de.warn.command.stringOptionDescription
                } )
                .setRequired( true )
        )
        .setDefaultMemberPermissions( PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers )
        .setContexts( InteractionContextType.Guild ),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute( interaction ) {
        try {
            const userLang = interaction.locale.slice( 0, 2 )

            const user = interaction.options.getUser( 'user' )
            const reason = interaction.options.getString( 'reason' )

            if ( user.id === interaction.user.id )
                return interaction.reply( {
                    content: langData[ userLang ].warn.reply.notYourself,
                    ephemeral: true,
                } )

            const member = await interaction.guild.members.fetch( user.id )

            if ( member.permissions.has( PermissionsBitField.Flags.KickMembers, PermissionsBitField.Flags.BanMembers ) )
                return interaction.reply( {
                    content: langData[ userLang ].warn.reply.notAdmin,
                    ephemeral: true,
                } )

            amountOfWarnsOnUser = await warns.count( {
                where: {
                    guildId: interaction.guild.id,
                    userId: user.id,
                },
            } )

            const warnEmbed = new EmbedBuilder()
                .setTitle( langData[ userLang ].warn.embed.title )
                .setFields( [
                    {
                        name: langData[ userLang ].warn.embed.fields[ 0 ].name,
                        value: reason,
                    },
                ] )
                .setColor( 'Red' )
                .setTimestamp()

            await warns.create( {
                guildId: interaction.guild.id,
                userId: user.id,
                reason: reason,
            } )

            if ( amountOfWarnsOnUser >= 3 ) {
                const reminderEmbed = new EmbedBuilder()
                    .setTitle( langData[ userLang ].warn.embed.title )
                    .setFields( [
                        {
                            name: langData[ userLang ].warn.embed.fields[ 0 ].name2 + `${ user.username }` + langData[ userLang ].warn.embed.fields[ 1 ].name2 + `${ amountOfWarnsOnUser }`,
                            value: ' ',
                        },
                    ] )
                    .setFooter( {
                        text: langData[ userLang ].warn.embed.footer,
                    } )
                    .setColor( 'Red' )

                await interaction.reply( {
                    embeds: [ reminderEmbed ],
                    ephemeral: true,
                } )
                await wait( 1000 )
                await interaction.followUp( { embeds: [ warnEmbed ] } )
            }

            await interaction.reply( { embeds: [ warnEmbed ], ephemeral: true } )
        } catch ( error ) {
            console.error( 'Error in ' + interaction.commandName + ' command:', error );
            const errorMessage = 'An error occurred while processing your request.';

            if ( !interaction.replied ) {
                await interaction.reply( {
                    content: errorMessage,
                    ephemeral: true
                } );
            }
        }
    },
}

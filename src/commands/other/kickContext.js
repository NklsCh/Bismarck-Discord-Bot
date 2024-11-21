const {
    ApplicationCommandType,
    ContextMenuCommandBuilder,
    PermissionsBitField,
    UserContextMenuCommandInteraction
} = require( 'discord.js' )

const langData = require( `../../../resources/translations/lang.json` )

const handleKick = require( '../../functions/handleKick' )

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName( 'Kick' )
        .setType( ApplicationCommandType.User ),
    /**
     * Executes the command when invoked by an interaction.
     * @param {UserContextMenuCommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute( interaction ) {
        try {
            const userLang = interaction.locale.slice( 0, 2 )
            const member = interaction.targetUser
            const guild = interaction.guild
            const memberInGuild = await guild.members.fetch( member.id )
            const { KickMembers } = PermissionsBitField.Flags
            if (
                interaction.member.permissions.has( KickMembers ) &&
                !member.bot
            ) {
                handleKick( memberInGuild )
                interaction.reply( {
                    content: langData[ userLang ].success.kickSuccess,
                    ephemeral: true
                } )
            } else {
                interaction.reply( {
                    content: langData[ userLang ].errors.noPerms,
                    ephemeral: true
                } )
            }
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

const {
    ChatInputCommandInteraction,
    InteractionContextType,
    PermissionsBitField,
    SlashCommandBuilder,
} = require( 'discord.js' )
const CMessage = require( '../../../models/cMessage' )

const langData = require( `../../../resources/translations/lang.json` )

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'welcome' )
        .setDescription( langData.en.welcome.command.description )
        .setDescriptionLocalizations( {
            de: langData.de.welcome.command.description,
        } )
        .addStringOption( ( option ) =>
            option
                .setName( 'message' )
                .setDescription(
                    langData.en.welcome.command.stringOptionDescription
                )
                .setDescriptionLocalizations( {
                    de: langData.de.welcome.command.stringOptionDescription,
                } )
        )
        .setDefaultMemberPermissions( PermissionsBitField.Flags.Administrator )
        .setContexts( InteractionContextType.Guild ),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute( interaction ) {
        try {
            const userLang = interaction.locale.slice( 0, 2 )

            const [ customMessage ] = await CMessage.findOrCreate( {
                where: {
                    guildId: interaction.guild.id,
                },
            } )
            await interaction.deferReply( { ephemeral: true } )
            const welcomeMessage = interaction.options.getString( 'message' )
            await customMessage
                .update( {
                    welcomeMessage: welcomeMessage,
                } )
                .then( async () => {
                    if ( !( await customMessage.welcomeMessage ) ) {
                        await interaction.editReply( {
                            content: langData[ userLang ].welcome.reply.messageReset,
                            ephemeral: true,
                        } )
                        return
                    }
                    await interaction.editReply( {
                        content: langData[ userLang ].welcome.reply.messageSet,
                        ephemeral: true,
                    } )
                } )
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

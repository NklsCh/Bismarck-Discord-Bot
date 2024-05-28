const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    PermissionsBitField,
    UserContextMenuCommandInteraction
} = require( 'discord.js' )

const langData = require( `../../../resources/translations/lang.json` )

const handleBan = require( '../../functions/handleBan' )

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName( 'Ban' )
        .setType( ApplicationCommandType.User ),
    /**
     * Executes the command when invoked by an interaction.
     * @param {UserContextMenuCommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute( interaction ) {
        const userLang = interaction.locale.slice( 0, 2 )
        const member = interaction.targetUser
        const guild = interaction.guild
        const memberInGuild = await guild.members.fetch( member.id )
        const { BanMembers } = PermissionsBitField.Flags
        if (
            interaction.member.permissions.has( BanMembers ) &&
            !member.bot
        ) {
            handleBan( memberInGuild )
            interaction.reply( {
                content: langData[ userLang ].success.banSuccess,
                ephemeral: true
            } )
        } else {
            interaction.reply( {
                content: langData[ userLang ].errors.noPerms,
                ephemeral: true
            } )
        }
    },
}

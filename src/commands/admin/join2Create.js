const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require( 'discord.js' )
const Guilds = require( '../../../models/guilds' )

const langData = require( `../../../resources/translations/lang.json` )

module.exports = {
    data: new SlashCommandBuilder()
        .setName( 'join2create' )
        .setDescription( langData.en.join2Create.command.description )
        .setDescriptionLocalizations( {
            de: langData.de.join2Create.command.description,
        } )
        .addChannelOption( ( option ) =>
            option
                .setName( 'channel' )
                .setDescription( langData.en.join2Create.command.channelOptionDescription )
                .setDescriptionLocalizations( {
                    de: langData.de.join2Create.command.channelOptionDescription,
                } )
        )
        .setDefaultMemberPermissions( Administrator )
        .setDMPermission( false ),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute( interaction ) {
        const userLang = interaction.locale.slice( 0, 2 )
        const [ dbGuild ] = await Guilds.findOrCreate( {
            where: { guildId: interaction.guild.id },
        } )

        const channel = interaction.options.getChannel( 'channel' )

        if ( !channel ) {
            await interaction.reply( {
                content: langData[ userLang ].join2Create.reply.deactivated,
                ephemeral: true,
            } ).then( async () => {
                await dbGuild.update( {
                    join2CreateChannelId: null,
                } )
                return
            } )

        }
        await interaction.reply( {
            content: langData[ userLang ].join2Create.reply.activated,
            ephemeral: true,
        } )
        await dbGuild.update( {
            join2CreateChannelId: channel.id,
        } )
    },
}

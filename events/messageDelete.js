const { Events, EmbedBuilder } = require( "discord.js" );
const Guilds = require( '../models/guilds' )

module.exports = {
    name: Events.MessageDelete,
    /**
     * Executes the message update event.
     * @param {Message} message - The updated message object.
     */
    async execute( message ) {

        if ( message.author.bot ) return;

        const [ dbguild ] = await Guilds.findOrCreate( {
            where: {
                guildId: message.guild.id,
            },
        } );

        const channelId = await dbguild.logChannelId;

        if ( channelId === null ) return;

        const logChannel = await message.guild.channels
            .fetch( channelId )

        var date = new Date().getTime();

        const messageDeletedEmbed = new EmbedBuilder()
            .setColor( '#0099ff' )
            .setTitle( 'Message Deleted' )
            .setThumbnail( message.author.displayAvatarURL( { dynamic: true } ) )
            .setFields(
                {
                    name: 'Message ID',
                    value: `${ message.id }`,
                },
                {
                    name: 'Author',
                    value: `<@${ message.author.id }>`,

                },
                {
                    name: 'Message Content',
                    value: `${ message.content }`,
                },
                {
                    name: 'Channel',
                    value: `<#${ message.channel.id }>`,
                },
                {
                    name: 'Message Timestamp',
                    value: `<t:${ parseInt( date / 1000 ) }:R>`,
                    inline: true
                }
            )

        logChannel.send( {
            embeds: [ messageDeletedEmbed ]
        } )
    },
};
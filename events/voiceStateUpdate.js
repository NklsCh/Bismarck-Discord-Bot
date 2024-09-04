const { Events, VoiceState, PermissionFlagsBits, ChannelType } = require( 'discord.js' );
const Guilds = require( '../models/guilds' );

module.exports = {
    name: Events.VoiceStateUpdate,
    /**
     * Executes the voice state update event.
     * @param {VoiceState} oldState - The old voice state object.
     * @param {VoiceState} newState - The new voice state object.
     */
    async execute( oldState, newState ) {
        if ( !newState.channel ) {
            if ( oldState.channel && oldState.channel.members.size === 0 ) {
                if ( oldState.channel.name.endsWith( "'s room" ) ) {
                    try {
                        await oldState.channel.delete();
                    } catch ( error ) {
                        console.error( 'Error deleting empty voice channel:', error.message );
                    }
                }
            }
            return;
        }

        const guild = newState.guild;
        const member = newState.member;
        const voiceChannel = newState.channel;

        const [ dbguild ] = await Guilds.findOrCreate( {
            where: {
                guildId: guild.id,
            },
        } );

        const join2Create = await dbguild.join2CreateChannelId;

        if ( !join2Create ) return;

        if ( voiceChannel.id === join2Create ) {
            try {
                const newVoiceChannel = await guild.channels.create( {
                    name: `${ member.user.username }'s room`,
                    type: ChannelType.GuildVoice,
                    parent: voiceChannel.parentId,
                } );

                await member.voice.setChannel( newVoiceChannel.id );
            } catch ( error ) {
                console.error( 'Error creating voice channel or moving member:', error.message );
                console.error( 'Ensure the bot has the required permissions: Manage Channels, Move Members, View Channel, Connect.' );
            }
        }
    },
};

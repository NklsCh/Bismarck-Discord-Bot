const { Events, VoiceState } = require('discord.js')
const Guilds = require('../models/guilds')

module.exports = {
    name: Events.VoiceStateUpdate,
    /**
     * Executes the voice state update event.
     * @param {VoiceState} oldState - The old voice state object.
     * @param {VoiceState} newState - The new voice state object.
     */
    async execute(oldState, newState) {
        const { member, guild, client } = newState

        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: guild.id,
            },
        })

        const oldStateChannel = oldState.channel
        const newStateChannel = newState.channel
        const join2Create = await dbguild.join2Create

        if (
            oldStateChannel !== newStateChannel &&
            newStateChannel.id === join2Create
        ) {
            const voiceChannel = await newState.guild.channels.create(
                `${member.user.username}`,
                {
                    type: 'GUILD_VOICE',
                    parent: newStateChannel.parent,
                    permissionOverwrites: [
                        {
                            id: member.id,
                            allow: ['VIEW_CHANNEL'],
                        },
                        {
                            id: guild.id,
                            deny: ['CONNECT'],
                        },
                    ],
                }
            )

            client.voiceGenerator.set(member.id, voiceChannel.id)
            await newState.permissionOverwrites.edit(member, { CONNECT: false })
            setTimeout(
                () =>
                    newState.permissionOverwrites.edit(member, {
                        CONNECT: true,
                    }),
                30 * 1000
            )

            return setTimeout(() => member.voice.setChannel(voiceChannel), 1000)
        }
    },
}

const { Events, GuildMember } = require('discord.js')
const Guilds = require('../models/guilds')

module.exports = {
    name: Events.GuildMemberRemove,
    /**
     * Executes the memberRemove event.
     * @param {GuildMember} GuildMember - The GuildMember object representing the member who left the server.
     * @returns {Promise<void>}
     */
    async execute(GuildMember) {
        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: GuildMember.guild.id,
            },
        });
        if (!(await dbguild.goodbyeChannelId)) return;
        GuildMember.guild.channels
            .fetch(await dbguild.goodbyeChannelId)
            .then((channel) => {
                channel.send(`**${GuildMember.user.username}** left the server!`);
            });
    },
};

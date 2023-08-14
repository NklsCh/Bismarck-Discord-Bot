const { Events } = require('discord.js')
const Guilds = require('../models/guilds')

module.exports = {
    name: Events.GuildMemberRemove,
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
                channel.send(`**${GuildMember.user.tag}** left the server!`);
            });
    },
};

const { Events } = require("discord.js");
const Guilds = require("../models/guilds");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client) {
        const dbguild = await Guilds.findOne({
            where: {
                guildId: client.guild.id,
            },
        });
        if (!dbguild.goodbyeChannelId) return;
        let channel = client.guild.channels.cache.get(dbguild.goodbyeChannelId);
        channel.send(`**${client.user.tag}** left the server!`);
    },
};

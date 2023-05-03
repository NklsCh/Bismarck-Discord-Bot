const { Events } = require("discord.js");
const Guilds = require("../models/guilds");

module.exports = {
    name: Events.GuildMemberRemove,
    async execute(client) {
        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: client.guild.id,
            },
        });
        if (!(await dbguild.goodbyeChannelId)) return;
        client.guild.channels
            .fetch(await dbguild.goodbyeChannelId)
            .then((channel) => {
                channel.send(`**${client.user.tag}** left the server!`);
            });
    },
};

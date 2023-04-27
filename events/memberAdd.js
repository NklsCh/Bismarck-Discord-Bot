const { Events } = require("discord.js");
const Guilds = require("../models/Guilds.js");

module.exports = {
    name: Events.GuildMemberAdd,
    async execute(client) {
        const name = client.guild.name;
        const dbguild = await Guilds.findOne({
            where: {
                guildId: client.guild.id,
            },
        });

        const helloEmbed = {
            color: 0x0099ff,
            title: "**Welcome**",
            thumbnail: {
                url: client.user.avatarURL(),
            },
            description: "Welcome " + client.user.tag + " to " + name + "!",
        };
        if (!dbguild.welcomeChannelId) return;
        let channel = client.guild.channels.cache.get(dbguild.welcomeChannelId);
        channel.send({ embeds: [helloEmbed] });
    },
};

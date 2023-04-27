const { ActivityType } = require("discord.js");
const Guild = require("../models/Guilds");

module.exports = {
    name: "guildDelete",
    async execute(guild) {
        let client = guild.client;

        const serverAmount = client.guilds.cache;

        await Guild.destroy({
            where: {
                guildId: guild.id,
            },
        });

        client.user.setPresence({
            activities: [
                {
                    name: `${serverAmount.size} Server(s)`,
                    type: ActivityType.Watching,
                },
            ],
            status: "online",
        });
    },
};

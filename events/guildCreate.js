const { ActivityType } = require("discord.js");
const Guild = require("../models/Guilds");

module.exports = {
    name: "guildCreate",
    async execute(guild) {
        let client = guild.client;

        const dbguild = await Guild.create({
            guildId: guild.id,
        });
        const serverAmount = client.guilds.cache;

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

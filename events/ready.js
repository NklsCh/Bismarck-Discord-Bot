
const { ActivityType } = require("discord.js");
const Guild = require("../models/guilds");

module.exports = {
    name: "ready",
    once: true,
    async execute(client) {
        let memberAmount = 0;

        Guild.sync();

        //Get the amount of all users from all servers
        client.guilds.cache.forEach((guild) => {
            memberAmount += guild.members.cache.filter(
                (member) => !member.user.bot
            ).size;
        });

        const serverAmount = client.guilds.cache;

        client.user.setPresence({
            activities: [
                {
                    name: `${new Intl.NumberFormat("de-DE").format(
                        memberAmount
                    )} users in ${serverAmount.size} server(s)`,
                    type: ActivityType.Watching,
                },
            ],
            status: "online",
        });

        //Get the config file for the server and change the channel name to the amount of users in the server

        setInterval(() => {
            client.guilds.cache.forEach(async (guild) => {
                const dbguild = await Guild.findOne({
                    where: {
                        guildId: guild.id,
                    },
                });
                //Get all online users from guild
                let onlineUsers = guild.members.cache.filter(
                    (member) =>
                        (member.presence?.status === "online" ||
                            member.presence?.status === "idle" ||
                            member.presence?.status === "dnd") &&
                        !member.user.bot
                ).size;
                console.log(onlineUsers);
                if (!dbguild.onlineChannelId) return;
                guild.channels.edit(dbguild.onlineChannelId, {
                    name: `Online: ${onlineUsers}`,
                });
                if (!dbguild.allChannelId) return;
                guild.channels.edit(dbguild.allChannelId, {
                    name: `Members: ${guild.memberCount}`,
                });
                if (!dbguild.botChannelId) return;
                guild.channels.edit(dbguild.botChannelId, {
                    name: `Bots: ${
                        guild.members.cache.filter((member) => member.user.bot)
                            .size
                    }`,
                });
            });
                guild.channels.edit(config.botChannel, {name: `Bots: ${guild.members.cache.filter(member => member.user.bot).size}`});
            })
        }, 1000 * 30);
    },
};

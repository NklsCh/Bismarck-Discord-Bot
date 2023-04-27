const { ActivityType, Presence } = require("discord.js");
const fs = require("fs");

module.exports = {
    name: "ready",
    once: true,
    execute(client) {
        let memberAmount = 0;

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
            client.guilds.cache.forEach((guild) => {
                if (fs.existsSync("./config/" + guild.id + ".json") === false)
                    return;
                //Get all online users from guild
                let onlineUsers = guild.members.cache.filter(
                    (member) =>
                        (member.presence?.status === "online" ||
                            member.presence?.status === "idle" ||
                            member.presence?.status === "dnd") &&
                        !member.user.bot
                ).size;
                console.log(onlineUsers);
                let config = JSON.parse(
                    fs.readFileSync("./config/" + guild.id + ".json", "utf8")
                );
                if (!config.onlineChannel) return;
                guild.channels.edit(config.onlineChannel, {
                    name: `Online: ${onlineUsers}`,
                });
                if (!config.allChannel) return;
                guild.channels.edit(config.allChannel, {
                    name: `Members: ${guild.memberCount}`,
                });
                if (!config.botChannel) return;
                guild.channels.edit(config.botChannel, {
                    name: `Bots: ${
                        guild.members.cache.filter((member) => member.user.bot)
                            .size
                    }`,
                });
            });
        }, 1000 * 30);
    },
};

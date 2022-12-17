const { ActivityType } = require('discord.js');

module.exports = {
	name: 'guildDelete',
	execute(guild) {

        client = guild.client

        const serverAmount = client.guilds.cache

        client.user.setPresence({
            activities: [{
                name: `${serverAmount.size} Server(s)`,
                type: ActivityType.Watching
            }],
            status: "online"
        })

	},
}
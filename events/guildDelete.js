const { ActivityType } = require('discord.js');

module.exports = {
	name: 'guildDelete',
	execute(client) {

        let serverAmount = 2

        client.user.setPresence({
            activities: [{
                name: `${serverAmount.size} Server(s)`,
                type: ActivityType.Watching
            }],
            status: "online"
        })
	},
}
const { ActivityType } = require('discord.js');
const { fs } = require('fs');

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

        fs.unlinkSync('./server-configs/' + guild.id + '.json')

	},
}
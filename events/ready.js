const { ActivityType } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: 'ready',
	once: true,
	execute(client) {

        const serverAmount = client.guilds.cache;

		console.log(`Ready! Logged in as ${client.user.tag}`);
        client.user.setPresence({
            activities: [{
                name: `${serverAmount.size} Server(s)`,
                type: ActivityType.Watching
            }],
            status: "online"
        })
        //Get the config file for the server and change the channel name to the amount of users in the server
        client.guilds.cache.forEach(guild => {
            if(fs.existsSync('./server-configs/' + guild.id + '.json') === false) return;
            //Get all online users from guild
            let onlineUsers = guild.members.cache.filter(member => member.presence?.status === "online" | "dnd" | "idle" && !member.user.bot).size;
            let config = JSON.parse(fs.readFileSync('./server-configs/' + guild.id + '.json', 'utf8'));
            if(!config.onlineChannel) return;
            guild.channels.edit(config.onlineChannel, {name: `Online: ${onlineUsers}`});
            if(!config.allChannel) return;
            guild.channels.edit(config.allChannel, {name: `Members: ${guild.memberCount}`});
        })
	},
};
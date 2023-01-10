const { Events } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: Events.GuildMemberRemove,
	execute(client) {

        if(fs.existsSync('./config/' + client.guild.id + '.json') === false) return;
        let config = JSON.parse(fs.readFileSync('./config/' + client.guild.id + '.json', 'utf8'));
        if(!config.leftChannel) return;
        let channel = client.guild.channels.cache.get(config.leftChannel);
        channel.send(`**${client.user.tag}** left the server!`);

	},
};
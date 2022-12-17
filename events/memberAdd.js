const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
	name: Events.GuildMemberAdd,
	execute(client) {

        console.log(client.guild.name)

        const name = client.guild.name

        const helloEmbed = {
            color: 0x0099ff,
            title: '**Welcome**',
            thumbnail: {
                url: client.user.avatarURL(),
            },
            description: 'Welcome ' + client.user.tag + ' to ' + name + '!',
        }

        if(fs.existsSync('./server-configs/' + client.guild.id + '.json') === false) return;
        let config = JSON.parse(fs.readFileSync('./server-configs/' + client.guild.id + '.json', 'utf8'));
        if(!config.joinChannel) return;
        let channel = client.guild.channels.cache.get(config.joinChannel);
        channel.send({ embeds: [helloEmbed] });

	},
};
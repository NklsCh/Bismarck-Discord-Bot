const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isCommand() && !interaction.isButton()) return;
    
        const command = interaction.client.commands.get(interaction.commandName);
        
        if (command) {
            try {
                await command.execute(interaction);
            } catch (error) {
                console.error(error);
                await interaction.reply({ content: "There was an error while executing this command!", ephemeral: true });
            }
        } 
        
        if(interaction.isButton()) {
            let isAdmin
            try {
                isAdmin = interaction.member.permissions.has(PermissionsBitField.ADMINISTRATOR);
            } catch (error) {
                isAdmin = false;
            }
            userid = interaction.message.embeds.map(embed => embed.footer.text)
            let user = interaction.guild.members.cache.find(user => user.id === userid[0])
            switch(interaction.customId) {
                case "kick":
                    if(interaction.guild.members.cache.get(user.id).kickable) {
                        try {
                            await interaction.guild.members.cache.get(user.id).kick();
                        } catch (error) {}
                    } else {
                        await interaction.reply({ephemeral: true, content: "I can't kick this user"});
                    }
                    interaction.reply({ephemeral: true, content: `The user ${user} has been kicked`});
                    break;
                case "ban":
                    if(interaction.guild.members.cache.get(user.id).bannable) {
                        try {
                            await interaction.guild.members.cache.get(user.id).ban();
                        } catch (error) {}
                    } else {
                        await interaction.reply({ephemeral: true, content: "I can't ban this user"});
                    }
                    interaction.reply({ephemeral: true, content: `The user ${user} has been banned`});
                    break;
                default:
                    await interaction.reply({ephemeral: true, content: "Button Clicked!"});
                    break;
            }
                    
        }
	},
};
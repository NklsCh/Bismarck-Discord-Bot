const {ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder} = require('discord.js');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Info")
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = interaction.targetUser;
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(`User info about ${member.tag}`)
                    .setThumbnail(member.displayAvatarURL({dynamic: true}))
                    .addFields([
                        {
                            name: "Account Creation Date",
                            value: `<t:${Math.round(member.createdTimestamp / 1000)}>`,
                            inline: true
                        },
                    ])
                    .setDescription(`${member.id}`)
                    .setFooter({text: `${member.id}`})
            ], ephemeral: true,
        })
    }
}
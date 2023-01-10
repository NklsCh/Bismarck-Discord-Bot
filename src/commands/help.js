const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setNameLocalizations({
        "de": "hilfe",
    })
    .setDescription("Shows all commands")
    .setDescriptionLocalizations({
        "de": "Zeigt alle Befehle an",
    }),
    async execute(interaction) {
        await interaction.reply({embeds: [
            new EmbedBuilder()
                .setTitle("**Help Page**")
                .setDescription("Here are all of my commands")
                .setAuthor({name: interaction.client.user.tag})
                //Show bot avatar
                .setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }))
                .addFields([
                    {
                        name: "Default",
                        value: "```/help\r/invite```",
                        inline: true
                    },
                    {
                        name: "Information",
                        value: "```/info @user```",
                        inline: true
                    },
                    {
                        name: "Administrator",
                        value: "```/track add online\r/track add all\r/track add bots\r/track remove online\r/track remove all\r/track remove bots\r/track list\r/channel setup join\r/channel setup leave\r/setup```",
                        inline: true
                    },
                ])
                .setFooter({text: `Note: More commands will be added soon`})
            ],
            ephemeral: true
        });
    }
}
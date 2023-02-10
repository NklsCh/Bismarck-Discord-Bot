const {SlashCommandBuilder} = require('@discordjs/builders');
const {EmbedBuilder} = require("discord.js");

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
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("**Help Page**")
                    .setDescription("Here are all of my commands")
                    .setAuthor({name: interaction.client.user.tag})
                    //Show bot avatar
                    .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
                    .addFields([
                        {
                            name: "User",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "  ",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "  ",
                            value: "  ",
                            inline: true
                        },
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
                            name: "  ",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "Administrator",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "  ",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "  ",
                            value: "  ",
                            inline: true
                        },
                        {
                            name: "Tracking",
                            value: "```/track add online\r/track add all\r/track add bots\r/track remove online\r/track remove all\r/track remove bots```",
                            inline: true
                        },
                        {
                            name: "Channel",
                            value: "```/channel set join\r/channel set leave\r/channel unset join\r/channel unset leave```",
                            inline: true
                        },
                        {
                            name: "Other",
                            value: "```/track list\r/setup```",
                            inline: true
                        },
                    ])
                    .setFooter({text: `Note: More commands will be added soon`})
            ],
            ephemeral: true
        });
    }
}
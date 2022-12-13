const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("help")
    .setNameLocalizations({
        "de": "hilfe",
        "en-US": "help",
    })
    .setDescription("Shows all commands")
    .setDescriptionLocalizations({
        "de": "Zeigt alle Befehle an",
        "en-US": "Shows all commands",
    }),
    async execute(interaction) {
        await interaction.reply({embeds: [
            new EmbedBuilder()
                .setTitle("**Help Page**")
                .setDescription("Here are all of my commands")
                .setAuthor({name: interaction.client.user.tag})
                //Show bot avatar
                .setThumbnail(interaction.client.user.displayAvatarURL({dynamic: true}))
                .addFields([
                    {
                        name: "/help",
                        value: "Shows all commands"
                    },
                    {
                        name: "/info",
                        value: "Shows info about a user"
                    },
                    {
                        name: "/ping",
                        value: "Replies with Pong!"
                    },
                    {
                        name: "/invite",
                        value: "Sends an invite link to invite me to your server"
                    },
                ])
                .setFooter({text: "Note: More commands will be added soon"})
            ]}
        );
    }
}
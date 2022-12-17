const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("contribute")
    .setDescription("Shows the contribute menu")
    .setDescriptionLocalizations({
        "de": "Zeigt das Beteiligungsmenü",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administratory),
    async execute(interaction) {
        donate = new ButtonBuilder()
            .setLabel("Donate")
            .setStyle(5)
            .setURL("https://buymeacoffee.com/nchoini")
        errorReport = new ButtonBuilder()
            .setLabel("Error Report")
            .setStyle(5)
            .setURL("https://github.com/NklsCh/Discord-Bot/issues/new")
        contributeRow = new ActionRowBuilder()
            .addComponents([donate, errorReport])
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle("Contribute")
                .setDescription("Here you can find all the contribute options")
                .addFields([
                    {
                        name: "Conations",
                        value: "You can donate money, to keep the server running and/or get the devs a coffee",
                    },
                    {
                        name: "Error Reporting",
                        value: "You can report errors, so the devs can fix them",
                    },
                ])
        ], ephemeral: true, components: [contributeRow] });
    }
}
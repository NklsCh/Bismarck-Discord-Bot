const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("contribute")
        .setDescription("Shows the contribute menu")
        .setDescriptionLocalizations({
            de: "Zeigt das Beteiligungsmenü",
        }),
    async execute(interaction) {
        let donate = new ButtonBuilder()
            .setLabel("Donate")
            .setStyle(5)
            .setURL("https://buymeacoffee.com/nchoini");
        let errorReport = new ButtonBuilder()
            .setLabel("Error Report")
            .setStyle(5)
            .setURL(
                "https://github.com/Proton-Bot-Development/Proton/issues/new"
            );
        let contributeRow = new ActionRowBuilder().addComponents([
            donate,
            errorReport,
        ]);
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Contribute")
                    .setDescription(
                        "Here you can find all the contribute options"
                    )
                    .addFields([
                        {
                            name: "Donations",
                            value: "You can donate money, to keep the server running and/or get the devs a coffee",
                        },
                        {
                            name: "Error Reporting",
                            value: "You can report errors, so the devs can fix them",
                        },
                    ]),
            ],
            ephemeral: true,
            components: [contributeRow],
        });
    },
};

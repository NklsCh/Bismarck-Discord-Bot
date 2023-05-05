const { PermissionFlagsBits: {Administrator}, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure the bot")
        .setDescriptionLocalizations({
            de: "Konfiguriere den Bot",
        })
        .addSubcommand((subcommand) =>
            subcommand
                .setName("show")
                .setDescription("Show the current configuration")
                .setDescriptionLocalizations({
                    de: "Zeige die aktuelle Konfiguration",
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        interaction.reply({
            content: "This command is not yet implemented",
            ephemeral: true,
        });
    },
};

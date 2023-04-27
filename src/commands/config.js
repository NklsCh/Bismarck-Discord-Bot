const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");

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
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {},
};

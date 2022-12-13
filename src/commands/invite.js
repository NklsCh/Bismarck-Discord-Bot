const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("invite")
    .setNameLocalizations({
        "de": "einladung",
        "en-US": "invite",
    })
    .setDescription("Get the invite link for the server")
    .setDescriptionLocalizations({
        "de": "Erhalte den Einladungslink für den Server",
        "en-US": "Get the invite link for the server",
    }),
    async execute(interaction) {
        await interaction.reply("https://discord.gg/KjrqqfQWdX");
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("invite")
    .setDescription("Get the invite link for the server"),
    async execute(interaction) {
        await interaction.reply("https://discord.gg/KjrqqfQWdX");
    }
}
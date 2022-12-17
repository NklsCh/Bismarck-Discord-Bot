const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Shows the setup menu")
    .setDescriptionLocalizations({
        "de": "Zeigt das Setup Menü",
    })
    .setDefaultMemberPermissions(PermissionFlagsBits.Administratory),
    async execute(interaction) {
        interaction.reply({ embeds: [
            new EmbedBuilder()
                .setTitle("Setup")
                .setDescription("Here you can find all the setup options")
                .addFields([
                    {
                        name: "Channels",
                        value: "```/channels setup join\r/channels setup leave\rYou can use this command to setup the channels for the join and leave messages```",
                    },
                    {
                        name: "Tracking",
                        value: "```/track add online```\rYou can use this command to track all online users\r```/track add all```\rYou can You can use this command to track all users\r```/track add bots```\rYou can You can use this command to track bots\r```/track remove online\r/track remove all\r/track remove bots```\rYou can use these commands to remove the tracking",
                    },
                ])
        ], ephemeral: true});
    }
}
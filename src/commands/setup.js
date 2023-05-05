const {
    PermissionFlagsBits: {Administrator},
    EmbedBuilder,
    SlashCommandBuilder,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setup")
        .setDescription("Shows the setup menu")
        .setDescriptionLocalizations({
            de: "Zeigt das Setup Menü",
        })
        .setDefaultMemberPermissions(Administrator),
    async execute(interaction) {
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Setup")
                    .setDescription("Here you can find all the setup options")
                    .addFields([
                        {
                            name: "/channel set",
                            value: "```/channels set join\r/channels set leave```\rYou can use these commands to set the channels for the join and leave messages",
                            inline: true,
                        },
                        {
                            name: "/channel unset",
                            value: "```/channel unset join\r/channel unset leave```\rYou can use these commands to unset the channels for the join and leave messages",
                            inline: true,
                        },
                        {
                            //Blank placeholder
                            name: "  ",
                            value: "  ",
                            inline: true,
                        },
                        {
                            name: "Track online",
                            value: "```/track add online\r/track remove online```\rYou can use this command to track all online users or remove the tracking",
                            inline: true,
                        },
                        {
                            name: "Track all",
                            value: "```/track add all\r/track remove all```\rYou can You can use this command to track all users or remove the tracking",
                            inline: true,
                        },
                        {
                            name: "Track Bots",
                            value: "```/track add bots\r/track remove bots```\rYou can You can use this command to track bots or remove the tracking",
                            inline: true,
                        },
                    ]),
            ],
            ephemeral: true,
        });
    },
};

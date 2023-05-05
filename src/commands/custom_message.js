const { PermissionFlagsBits: {Administrator}, SlashCommandBuilder } = require("discord.js");
const CMessage = require("../../models/cMessage");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("custom_message")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("welcome")
                .setDescription("Set a custom welcome message")
                .setDescriptionLocalizations({
                    de: "Setze eine benutzerdefinierte Willkommensnachricht",
                })
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("The message to send")
                        .setDescriptionLocalizations({
                            de: "Die Nachricht, die gesendet werden soll",
                        })
                        .setRequired(true)
                )
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("goodbye")
                .setDescription("Set a custom goodbye message")
                .setDescriptionLocalizations({
                    de: "Setze eine benutzerdefinierte Abschiedsnachricht",
                })
                .addStringOption((option) =>
                    option
                        .setName("message")
                        .setDescription("The message to send")
                        .setDescriptionLocalizations({
                            de: "Die Nachricht, die gesendet werden soll",
                        })
                        .setRequired(true)
                )
        )
        .setDescription("Set a custom welcome or goodbye message")
        .setDescriptionLocalizations({
            de: "Setze eine benutzerdefinierte Willkommens- oder Abschiedsnachricht",
        })
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const [customMessage] = await CMessage.findOrCreate({
            where: {
                guildId: interaction.guild.id,
            },
        });
        switch (interaction.options.getSubcommand()) {
            case "welcome":
                await interaction.deferReply();
                const welcomeMessage = interaction.options.getString("message");
                await customMessage.update({
                    welcomeMessage: welcomeMessage,
                }).then(() => {
                    interaction.editReply({
                        content: "Successfully set the welcome message!",
                        ephemeral: true,
                        });
                });
                break;
            case "goodbye":
                await interaction.deferReply();
                const goodbyeMessage = interaction.options.getString("message");
                await customMessage
                    .update({
                        goodbyeMessage: goodbyeMessage,
                    })
                    .then(() => {
                        interaction.editReply({
                            content: "Successfully set the welcome message!",
                            ephemeral: true,
                        });
                    });
                break;
            default:
                await interaction.reply({
                    content: "Please specify a valid subcommand!",
                    ephemeral: true,
                });
        }
    },
};

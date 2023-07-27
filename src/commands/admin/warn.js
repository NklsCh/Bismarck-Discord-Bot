const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    EmbedBuilder,
} = require("discord.js");
const warns = require("../../../models/warns");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Warn a user")
        .addUserOption((option) =>
            option
                .setName("user")
                .setDescription("The user to warn")
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName("reason")
                .setDescription("The reason for the warn")
                .setRequired(true)
        ),
    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason");

        if (user.id === interaction.user.id)
            return interaction.reply({
                content: "You cannot warn yourself!",
                ephemeral: true,
            });

        const member = await interaction.guild.members.fetch(user.id);

        if (member.permissions.has(Administrator))
            return interaction.reply({
                content: "You cannot warn an administrator!",
                ephemeral: true,
            });

        const warnEmbed = new EmbedBuilder()
            .setTitle("Warn")
            .setFields([
                {
                    name: "Reason",
                    value: reason,
                },
            ])
            .setColor("Red")
            .setTimestamp();

        await warns.create({
            guildId: interaction.guild.id,
            userId: user.id,
            reason: reason,
        });

        await interaction.reply({ embeds: [warnEmbed]});
    },
};

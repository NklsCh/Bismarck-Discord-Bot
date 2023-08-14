const {
    PermissionFlagsBits: { KickMembers, BanMembers },
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js')
const wait = require('node:timers/promises').setTimeout
const warns = require('../../../models/warns')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription('Warn a user')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to warn')
                .setRequired(true)
        )
        .addStringOption((option) =>
            option
                .setName('reason')
                .setDescription('The reason for the warn')
                .setRequired(true)
        )
        .setDefaultMemberPermissions(KickMembers, BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const reason = interaction.options.getString('reason')

        if (user.id === interaction.user.id)
            return interaction.reply({
                content: 'You cannot warn yourself!',
                ephemeral: true,
            })

        const member = await interaction.guild.members.fetch(user.id)

        if (member.permissions.has(KickMembers, BanMembers))
            return interaction.reply({
                content: 'You cannot warn an administrator!',
                ephemeral: true,
            })

        amountOfWarnsOnUser = await warns.count({
            where: {
                guildId: interaction.guild.id,
                userId: user.id,
            },
        })

        const warnEmbed = new EmbedBuilder()
            .setTitle('Warn-System')
            .setFields([
                {
                    name: 'Reason',
                    value: reason,
                },
            ])
            .setColor('Red')
            .setTimestamp()

        await warns.create({
            guildId: interaction.guild.id,
            userId: user.id,
            reason: reason,
        })

        if (amountOfWarnsOnUser >= 3) {
            const reminderEmbed = new EmbedBuilder()
                .setTitle('Warn-System')
                .setFields([
                    {
                        name: `The user ${user.username} has already been warned ${amountOfWarnsOnUser} times!`,
                        value: ' ',
                    },
                ])
                .setFooter({
                    text: 'You should consider taking action or reset the warns with /resetwarns',
                })
                .setColor('Red')

            await interaction.reply({
                embeds: [reminderEmbed],
                ephemeral: true,
            })
        }

        await wait(1000)
        await interaction.followUp({ embeds: [warnEmbed] })
    },
}

const {
    PermissionFlagsBits: { KickMembers, BanMembers },
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js')
const warns = require('../../../models/warns')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetwarns')
        .setDescription('Reset the warns of a user')
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The user to reset the warns of')
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The amount of warns to reset | Default: all')
        )
        .setDefaultMemberPermissions(KickMembers, BanMembers)
        .setDMPermission(false),
    async execute(interaction) {
        const userid = interaction.options.getUser('user').id
        const amount = interaction.options.getInteger('amount') ?? 'all'

        const resetEmbed = new EmbedBuilder()
            .setTitle('Warn-System')
            .setFields([
                {
                    name: 'You have reset the warns of the user',
                    value: `Amount: ${amount}`,
                },
            ])
            .setColor('Green')
            .setTimestamp()

        //search db for atleast 1 warn else return
        const userWarns = await warns.findOne({
            where: {
                guildId: interaction.guild.id,
                userId: userid,
            },
        })

        if (!userWarns)
            return interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle('Warn-System')
                        .setFields([
                            {
                                name: 'The user has no warns',
                                value: 'Nothing to reset',
                            },
                        ])
                        .setColor('Green'),
                ],
                ephemeral: true,
            })

        await warns.destroy({
            where: {
                guildId: interaction.guild.id,
                userId: userid,
            },
            limit: amount,
        })

        await interaction.reply({ embeds: [resetEmbed] })
    },
}

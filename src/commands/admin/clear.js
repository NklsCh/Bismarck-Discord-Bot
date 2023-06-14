const {
    SlashCommandBuilder,
    PermissionFlagsBits: { ManageMessages },
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clear messages')
        .setDescriptionLocalizations({
            de: 'Lösche Nachrichten',
        })
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription('The amount of messages to delete')
                .setDescriptionLocalizations({
                    de: 'Die Anzahl der zu löschenden Nachrichten',
                })
                .setRequired(true)
        )
        .setDefaultMemberPermissions(ManageMessages),
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount')

        if (amount > 100) {
            return interaction.reply({
                ephemeral: true,
                content: 'You cannot delete more than 100 messages',
            })
        }

        if (amount < 1) {
            return interaction.reply({
                ephemeral: true,
                content: 'You must delete at least 1 message',
            })
        }

        await interaction.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err)
            return interaction.reply({
                ephemeral: true,
                content: 'There was an error while deleting messages',
            })
        })

        await interaction.reply({
            ephemeral: true,
            content: `Deleted ${amount} messages`,
        })
    },
}

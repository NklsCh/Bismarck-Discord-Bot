const {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    PermissionFlagsBits: { ManageMessages },
} = require('discord.js')

const langData = require('../../../resources/translations/lang.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription(langData.en.clear.command.description)
        .setDescriptionLocalizations({
            de: langData.de.clear.command.description,
        })
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription(
                    langData.en.clear.command.integerOptionDescription
                )
                .setDescriptionLocalizations({
                    de: langData.de.clear.command.integerOptionDescription,
                })
                .setRequired(true)
        )
        .setDefaultMemberPermissions(ManageMessages),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute(interaction) {
        const userlang = interaction.locale.slice(0, 2)

        const amount = interaction.options.getInteger('amount')

        if (amount > 100) {
            return interaction.reply({
                ephemeral: true,
                content: langData[userlang].clear.reply.over100,
            })
        }

        if (amount < 1) {
            return interaction.reply({
                ephemeral: true,
                content: langData[userlang].clear.reply.under1,
            })
        }

        await interaction.channel.bulkDelete(amount, true).catch((err) => {
            console.error(err)
            return interaction.reply({
                ephemeral: true,
                content: langData[userlang].clear.reply.error,
            })
        })

        await interaction.reply({
            ephemeral: true,
            content: `${amount}` + langData[userlang].clear.reply.success,
        })
    },
}

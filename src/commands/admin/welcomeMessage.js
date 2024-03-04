const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    CommandInteraction
} = require('discord.js')
const CMessage = require('../../../models/cMessage')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription(langData.en.welcome.command.description)
        .setDescriptionLocalizations({
            de: langData.de.welcome.command.description,
        })
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription(
                    langData.en.welcome.command.stringOptionDescription
                )
                .setDescriptionLocalizations({
                    de: langData.de.welcome.command.stringOptionDescription,
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    /**
     * @param {CommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const [customMessage] = await CMessage.findOrCreate({
            where: {
                guildId: interaction.guild.id,
            },
        })
        await interaction.deferReply({ ephemeral: true })
        const welcomeMessage = interaction.options.getString('message')
        await customMessage
            .update({
                welcomeMessage: welcomeMessage,
            })
            .then(async () => {
                if (!(await customMessage.welcomeMessage)) {
                    await interaction.editReply({
                        content: langData[userLang].welcome.reply.messageReset,
                        ephemeral: true,
                    })
                    return
                }
                await interaction.editReply({
                    content: langData[userLang].welcome.reply.messageSet,
                    ephemeral: true,
                })
            })
    },
}

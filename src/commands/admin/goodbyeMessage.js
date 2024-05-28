const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js')
const CMessage = require('../../../models/cMessage')

const langData = require('../../../resources/translations/lang.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodbye')
        .setDescription(langData.en.goodbye.command.description)
        .setDescriptionLocalizations({
            de: langData.de.goodbye.command.description,
        })
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription(
                    langData.en.goodbye.command.messageOptionDescription
                )
                .setDescriptionLocalizations({
                    de: langData.de.goodbye.command.messageOptionDescription,
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const [customMessage] = await CMessage.findOrCreate({
            where: {
                guildId: interaction.guild.id,
            },
        })
        await interaction.deferReply({ ephemeral: true })
        const goodbyeMessage = interaction.options.getString('message')
        await customMessage
            .update({
                goodbyeMessage: goodbyeMessage,
            })
            .then(async () => {
                if (!(await customMessage.goodbyeMessage)) {
                    await interaction.editReply({
                        content: langData[userLang].goodbye.reply.messageSet,
                        ephemeral: true,
                    })
                    return
                }
                await interaction.editReply({
                    content: langData[userLang].goodbye.reply.messageReset,
                    ephemeral: true,
                })
            })
    },
}

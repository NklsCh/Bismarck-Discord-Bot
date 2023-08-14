const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
} = require('discord.js')
const CMessage = require('../../../models/cMessage')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodbye')
        .setDescription('Set a custom goodbye message')
        .setDescriptionLocalizations({
            de: 'Setze eine benutzerdefinierte Abschiedsnachricht',
        })
        .addStringOption((option) =>
            option
                .setName('message')
                .setDescription(
                    'The custom welcome message (Leave empty to reset)'
                )
                .setDescriptionLocalizations({
                    de: 'Die Nachricht, die gesendet werden soll (Leer lassen um zurückzusetzen)',
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    async execute(interaction) {
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
                        content: 'Successfully reset the goodbye message!',
                        ephemeral: true,
                    })
                    return
                }
                await interaction.editReply({
                    content: 'Successfully set the goodbye message!',
                    ephemeral: true,
                })
            })
    },
}

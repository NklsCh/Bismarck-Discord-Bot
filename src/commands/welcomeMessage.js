const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
} = require('discord.js')
const CMessage = require('../../models/cMessage')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('welcome')
        .setDescription('Set a custom welcome message')
        .setDescriptionLocalizations({
            de: 'Setze eine benutzerdefinierte Willkommensnachricht',
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
        const welcomeMessage = interaction.options.getString('message')
        await customMessage
            .update({
                welcomeMessage: welcomeMessage,
            })
            .then(async () => {
                if (!(await customMessage.welcomeMessage)) {
                    await interaction.editReply({
                        content: 'Successfully reset the welcome message!',
                        ephemeral: true,
                    })
                    return
                }
                await interaction.editReply({
                    content: 'Successfully set the welcome message!',
                    ephemeral: true,
                })
            })
    },
}

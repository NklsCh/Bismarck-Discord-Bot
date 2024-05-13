const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js')
const Guilds = require('../../../models/guilds')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autorole')
        .setDescription(langData.en.joinRole.command.description)
        .setDescriptionLocalizations({
            de: langData.de.joinRole.command.description,
        })
        .addRoleOption((roleOption) =>
            roleOption
                .setName('role')
                .setDescription(
                    langData.en.joinRole.command.roleOptionDescription
                )
                .setDescriptionLocalizations({
                    de: langData.de.joinRole.command.roleOptionDescription,
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: interaction.guild.id,
            },
        })
        await interaction.deferReply({ ephemeral: true })
        const joinRole = interaction.options.getRole('role')
        if (!joinRole) {
            await dbguild.update({
                joinRoleId: null,
            })
            await interaction.editReply({
                content: langData[userLang].joinRole.reply.roleReset,
                ephemeral: true,
            })
            return
        }
        await dbguild
            .update({
                joinRoleId: joinRole.id,
            })
            .then(async () => {
                await interaction.editReply({
                    content: langData[userLang].joinRole.reply.roleSet,
                    ephemeral: true,
                })
            })
    },
}

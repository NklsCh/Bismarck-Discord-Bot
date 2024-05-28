const {
    PermissionFlagsBits: { Administrator },
    SlashCommandBuilder,
    ChatInputCommandInteraction
} = require('discord.js')
const Guilds = require('../../../models/guilds')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logsystem')
        .setDescription(langData.en.logSystem.command.description)
        .setDescriptionLocalizations({
            de: langData.de.logSystem.command.description,
        })
        .addChannelOption((option) =>
            option
                .setName('channel')
                .setDescription(langData.en.logSystem.command.channelOptionDescription)
                .setDescriptionLocalizations({
                    de: langData.de.logSystem.command.channelOptionDescription,
                })
        )
        .setDefaultMemberPermissions(Administrator)
        .setDMPermission(false),
    /**
     * @param {ChatInputCommandInteraction} interaction - The interaction object.
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)
        const [guild] = await Guilds.findOrCreate({
            where: { guildId: interaction.guild.id },
        })

        if (!interaction.options.getChannel('channel')) {
            await guild.update({ logChannelId: null })
            return interaction.reply({
                content: langData[userLang].logSystem.reply.deactivated,
                ephemeral: true,
            })
        }

        const channelId = interaction.options.getChannel('channel').id
        await guild.update({ logChannelId: channelId })

        return interaction.reply({
            content: langData[userLang].logSystem.reply.activated,
            ephemeral: true,
        })
    },
}

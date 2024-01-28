const {
    PermissionFlagsBits: { KickMembers, BanMembers },
    SlashCommandBuilder,
    EmbedBuilder,
    CommandInteraction
} = require('discord.js')
const warns = require('../../../models/warns')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('resetwarns')
        .setDescription(langData.en.resetwarns.command.description)
        .setDescriptionLocalizations({
            de: langData.de.resetwarns.command.description,
        })
        .addUserOption((option) =>
            option
                .setName('user')
                .setDescription(langData.en.resetwarns.command.userOptionDescription)
                .setDescriptionLocalizations({
                    de: langData.de.resetwarns.command.userOptionDescription,
                })
                .setRequired(true)
        )
        .addIntegerOption((option) =>
            option
                .setName('amount')
                .setDescription(langData.en.resetwarns.command.integerOptionDescription)
                .setDescriptionLocalizations({
                    de: langData.de.resetwarns.command.integerOptionDescription,
                })
        )
        .setDefaultMemberPermissions(KickMembers, BanMembers)
        .setDMPermission(false),
    /**
     * @param {CommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const userid = interaction.options.getUser('user').id
        const amount = interaction.options.getInteger('amount') ?? null

        const resetEmbed = new EmbedBuilder()
            .setTitle(langData[userLang].resetwarns.embed.title)
            .setFields([
                {
                    name: langData[userLang].resetwarns.embed.fields[0].name,
                    value: langData[userLang].resetwarns.embed.fields[0].value + `${amount}`,
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
                        .setTitle(langData[userLang].resetwarns.embed.title)
                        .setFields([
                            {
                                name: langData[userLang].resetwarns.embed.fields[1].name,
                                value: langData[userLang].resetwarns.embed.fields[1].value,
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

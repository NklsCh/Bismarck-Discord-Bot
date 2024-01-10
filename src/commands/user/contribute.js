const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
} = require('discord.js')

const langData = require('../../../utils/lang.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(langData.contribute.name.en)
        .setNameLocalizations({
            de: langData.contribute.name.de,
        })
        .setDescription(langData.contribute.description.en)
        .setDescriptionLocalizations({
            de: langData.contribute.description.de,
        }),
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        let donate = new ButtonBuilder()
            .setLabel(langData.contribute.buttons.labelDonate[userLang])
            .setStyle(5)
            .setURL('https://buymeacoffee.com/nchoini')
        let errorReport = new ButtonBuilder()
            .setLabel(langData.contribute.buttons.labelGithub[userLang])
            .setStyle(5)
            .setURL('https://github.com/Proton-Bot-Development/Proton/')
        let contributeRow = new ActionRowBuilder().addComponents([
            donate,
            errorReport,
        ])
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle(langData.contribute.embed.title[userLang])
                    .setDescription(
                        langData.contribute.embed.description[userLang]
                    )
                    .addFields([
                        {
                            name: langData.contribute.embed.fields.donate[
                                userLang
                            ],
                            value: langData.contribute.embed.fields.donate
                                .description[userLang],
                        },
                        {
                            name: langData.contribute.embed.fields.github[
                                userLang
                            ],
                            value: langData.contribute.embed.fields.github
                                .description[userLang],
                        },
                    ]),
            ],
            ephemeral: true,
            components: [contributeRow],
        })
    },
}

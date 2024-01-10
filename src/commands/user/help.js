const {
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
} = require('discord.js')

const langData = require('../../../utils/lang.json')

module.exports = {
    data: new SlashCommandBuilder()
        .setName(langData.help.name.en)
        .setNameLocalizations({
            de: langData.help.name.de,
        })
        .setDescription(langData.help.description.en)
        .setDescriptionLocalizations({
            de: langData.help.description.de,
        }),
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)

        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

        const commands = await rest.get(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID)
        )

        const helpEmbed = new EmbedBuilder()
            .setTitle(langData.help.embed.title[userLang])
            .setDescription(langData.help.embed.description[userLang])
            .setAuthor({ name: interaction.client.user.tag })
            .setThumbnail(
                interaction.client.user.displayAvatarURL({ dynamic: true })
            )
            .setFooter({ text: langData.help.embed.footer[userLang] })

        //#TODO: Currently the base command of a subcommand group is shown in the embed. This should be fixed
        commands.forEach((command) => {
            if (command.name === 'Info') return
            helpEmbed.addFields({
                name: `</${command.name}:${command.id}>`
                    ? `</${command.name}:${command.id}>`
                    : 'No name',
                value: `${
                    command.description ? command.description : 'No description'
                }`,
            })
            command.options?.forEach((option) => {
                if (option.type == 2) {
                    option.options?.forEach((subOption) => {
                        helpEmbed.addFields({
                            name: `</${
                                command.name +
                                ' ' +
                                option.name +
                                ' ' +
                                subOption.name
                            }:${command.id}>`
                                ? `</${
                                      command.name +
                                      ' ' +
                                      option.name +
                                      ' ' +
                                      subOption.name
                                  }:${command.id}>`
                                : 'No name',
                            value: `${
                                subOption.description
                                    ? subOption.description
                                    : 'No description'
                            }`,
                        })
                    })
                }
                return
            })
        })

        await interaction.reply({
            embeds: [helpEmbed],
            ephemeral: true,
        })
    },
}

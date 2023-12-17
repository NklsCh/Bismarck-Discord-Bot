const {
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setNameLocalizations({
            de: 'hilfe',
        })
        .setDescription('Shows all commands')
        .setDescriptionLocalizations({
            de: 'Zeigt alle Befehle an',
        }),
    async execute(interaction) {
        interaction.deferReply({ ephemeral: true })
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

        const commands = await rest.get(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID)
        )

        const helpEmbed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here are all of my commands\r------------------')
            .setAuthor({ name: interaction.client.user.tag })
            .setThumbnail(
                interaction.client.user.displayAvatarURL({ dynamic: true })
            )
            .setFooter({ text: `Note: More commands will be added soon` })


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

        await interaction.editReply({
            embeds: [helpEmbed],
            ephemeral: true,
        })
    },
}

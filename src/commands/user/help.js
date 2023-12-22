const {
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
} = require('discord.js')
const makeHelpEmbed = require('../../functions/helpEmbedCreator')

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
        const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

        const commands = await rest.get(
            Routes.applicationCommands(process.env.DISCORD_APPLICATION_ID)
        )

        const helpEmbed = new EmbedBuilder()
            .setTitle('Help')
            .setDescription('Here are all commands\r------------------')
            .setColor('Blue')

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

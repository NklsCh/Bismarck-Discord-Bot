const {
    EmbedBuilder,
    SlashCommandBuilder,
    REST,
    Routes,
    Embed,
} = require('discord.js')
const fs = require('fs')
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

        const commandFolders = fs.readdirSync('./src/commands')

        const embeds = []
        commandFolders.forEach((folder) => {

            const commandf = fs.readdirSync(`./src/commands/${folder}`)
                .filter((file) => file.endsWith('.js'))

            let embed = makeHelpEmbed(interaction, folder)

            commandf.forEach((file) => {
                f = require(`../../commands/${folder}/${file}`)

                commands.forEach((command) => {
                    if (command.name === 'Info' || f.data.name !== command.name) return

                    const isBaseCommand =
                        command.options && command.options.length === 0
                    const isSubcommandGroup =
                        command.options &&
                        command.options.some((option) => option.type === 2)
                    const isToplevelCommand = !isBaseCommand && !isSubcommandGroup

                    if (isToplevelCommand) {
                        embed.addFields({
                            name: `</${command.name}:${command.id}>`
                                ? `</${command.name}:${command.id}>`
                                : 'No name',
                            value: `${command.description
                                ? command.description
                                : 'No description'
                                }`,
                        })
                    }
                    command.options?.forEach((option) => {
                        if (option.type == 2) {
                            option.options?.forEach((subOption) => {
                                embed.addFields({
                                    name: `</${command.name +
                                        ' ' +
                                        option.name +
                                        ' ' +
                                        subOption.name
                                        }:${command.id}>`
                                        ? `</${command.name +
                                        ' ' +
                                        option.name +
                                        ' ' +
                                        subOption.name
                                        }:${command.id}>`
                                        : 'No name',
                                    value: `${subOption.description
                                        ? subOption.description
                                        : 'No description'
                                        }`,
                                })
                            })
                        }
                        return
                    })
                })
            })
            embeds.push(embed)
        })


        await interaction.reply({
            embeds: [embeds[0], embeds[1], embeds[2]],
            ephemeral: true,
        })
    },
}

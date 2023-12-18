/**
 * Creates a help embed with the given commands.
 * @param {Object} interaction - The interaction object.
 * @param {Object} command1 - The first command object.
 * @param {Object} command2 - The second command object.
 * @param {Object} command3 - The third command object.
 * @param {Object} command4 - The fourth command object.
 * @param {Object} command5 - The fifth command object.
 * @returns {EmbedBuilder} - The help embed.
 */
const { EmbedBuilder } = require('discord.js');

function makeHelpEmbed(interaction, command1, command2, command3, command4, command5){
    return (new EmbedBuilder()
        .setTitle('Help')
        .setDescription('Here are all of my commands\r------------------')
        .setAuthor({ name: interaction.client.user.tag })
        .setThumbnail(
            interaction.client.user.displayAvatarURL({ dynamic: true })
        )
        .setFooter({ text: `Note: More commands will be added soon` })
        .addFields([
            {
                name: `</${command1.name}:${command1.id}>`
                    ? `</${command1.name}:${command1.id}>`
                    : 'No name',
                value: `${
                    command1.description ? command1.description : 'No description'
                }`,
            },
            {
                name: `</${command2.name}:${command2.id}>`
                    ? `</${command2.name}:${command2.id}>`
                    : 'No name',
                value: `${
                    command2.description ? command2.description : 'No description'
                }`,
            },
            {
                name: `</${command3.name}:${command3.id}>`
                    ? `</${command3.name}:${command3.id}>`
                    : 'No name',
                value: `${
                    command3.description ? command3.description : 'No description'
                }`,
            },
            {
                name: `</${command4.name}:${command4.id}>`
                    ? `</${command4.name}:${command4.id}>`
                    : 'No name',
                value: `${
                    command4.description ? command4.description : 'No description'
                }`,
            },
            {
                name: `</${command5.name}:${command5.id}>`
                    ? `</${command5.name}:${command5.id}>`
                    : 'No name',
                value: `${
                    command5.description ? command5.description : 'No description'
                }`,
            },
        ])
    )
}

module.exports = makeHelpEmbed;
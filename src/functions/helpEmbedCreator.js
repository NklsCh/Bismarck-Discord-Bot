/**
 * Creates a help embed with the given commands.
 * @param {Object} interaction - The interaction object.
 * @param {Object[]} commands - The commands to include in the help embed.
 * @param {string} folderName - The name of the folder that the commands are in.
 * @returns {EmbedBuilder} - The help embed.
 */
const { EmbedBuilder } = require('discord.js');

function makeHelpEmbed(interaction, folderName) {

    const helpEmbed = new EmbedBuilder()
        .setTitle('Help | ' + folderName)
        .setDescription('Here are all of my commands\r------------------')
        .setAuthor({ name: interaction.client.user.tag })
        .setThumbnail(
            interaction.client.user.displayAvatarURL({ dynamic: true })
        )
        .setFooter({ text: `Note: More commands will be added soon` })

    return (helpEmbed)
}

module.exports = makeHelpEmbed;
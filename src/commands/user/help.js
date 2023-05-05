const { EmbedBuilder, SlashCommandBuilder } = require('discord.js')

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
        const userEmbed = new EmbedBuilder()
            .setTitle('User')
            .setDescription('Here are all of my commands')
            .setAuthor({ name: interaction.client.user.tag })
            .setThumbnail(
                interaction.client.user.displayAvatarURL({ dynamic: true })
            )
            .addFields([
                {
                    name: 'Default',
                    value: '```/help```',
                    inline: true,
                },
                {
                    name: 'Information',
                    value: '```/info @user```',
                    inline: true,
                },
            ])
            .setFooter({ text: `Note: More commands will be added soon` })

        const adminEmbed = new EmbedBuilder()
            .setTitle('Administrator')
            .setDescription('Here are all of my commands')
            .setAuthor({ name: interaction.client.user.tag })
            .setThumbnail(
                interaction.client.user.displayAvatarURL({ dynamic: true })
            )
            .addFields([
                {
                    name: 'Tracking',
                    value: '```/track add online\r/track add all\r/track add bots\r/track remove online\r/track remove all\r/track remove bots```',
                    inline: true,
                },
                {
                    name: 'Channel',
                    value: '```/channel set join\r/channel set leave\r/channel unset join\r/channel unset leave```',
                    inline: true,
                },
                {
                    name: 'Other',
                    value: '```/track list\r/setup```',
                    inline: true,
                },
                {
                    name: 'Custom Messages',
                    value: '```/welcome\r/goodbye```',
                    inline: true,
                },
            ])
            .setFooter({ text: `Note: More commands will be added soon` })

        await interaction.reply({
            embeds: [userEmbed, adminEmbed],
            ephemeral: true,
        })
    },
}

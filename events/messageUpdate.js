const { Events, EmbedBuilder } = require("discord.js");
const Guilds = require('../models/guilds');

module.exports = {
    name: Events.MessageUpdate,
    /**
     * Executes the message update event.
     * @param {Message} message - The updated message object.
     * @returns {Promise<void>}
     */
    async execute(message) {

        if (message.author.bot) return;

        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: message.guild.id,
            },
        });

        const channelId = await dbguild.logChannelId;

        const logChannel = await message.guild.channels
            .fetch(channelId)

        if (!logChannel) return;

        var date = new Date().getTime();

        const messageUpdateEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Message Updated')
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
            .setFields(
                {
                    name: 'Message ID',
                    value: `${message.id}`,
                },
                {
                    name: 'Author',
                    value: `<@${message.author.id}>`,

                },
                {
                    name: 'Old Message',
                    value: `${message.content}`,
                },
                {
                    name: 'New Message',
                    value: `${message.reactions.message.content}`,
                },
                {
                    name: 'Channel',
                    value: `<#${message.channel.id}>`,
                },
                {
                    name: 'Message Timestamp',
                    value: `<t:${parseInt(date / 1000)}:R>`,
                    inline: true
                }
            )

        logChannel.send({
            embeds: [messageUpdateEmbed]
        })
    },
};

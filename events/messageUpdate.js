const { Events, EmbedBuilder, Message } = require("discord.js");
const Guilds = require('../models/guilds');

module.exports = {
    name: Events.MessageUpdate,
    /**
     * Executes the oldMessage update event.
     * @param {Message} oldMessage - The old Message object.
     * @param {Message} newMessage - The new Message object.
     */
    async execute(oldMessage, newMessage) {

        const { guild } = oldMessage;

        if (oldMessage.author.bot) return;

        const [dbguild] = await Guilds.findOrCreate({
            where: {
                guildId: guild.id,
            },
        });

        const channelId = await dbguild.logChannelId;

        const logChannel = await guild.channels
            .fetch(channelId)

        if (!logChannel) return;

        var date = new Date().getTime();

        const messageUpdateEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle('Message Updated')
            .setThumbnail(oldMessage.author.displayAvatarURL({ dynamic: true }))
            .setFields(
                {
                    name: 'Message ID',
                    value: `${oldMessage.id}`,
                },
                {
                    name: 'Author',
                    value: `<@${oldMessage.author.id}>`,

                },
                {
                    name: 'Old Message',
                    value: `${oldMessage.content}`,
                },
                {
                    name: 'New Message',
                    value: `${newMessage.content}`,
                },
                {
                    name: 'Channel',
                    value: `<#${oldMessage.channel.id}>`,
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

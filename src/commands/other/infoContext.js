const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ActionRowBuilder,
} = require('discord.js')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Info')
        .setType(ApplicationCommandType.User),
    async execute(interaction) {
        const member = interaction.targetUser
        const guild = interaction.guild
        const memberInGuild = await guild.members.fetch(member.id)
        let kick, ban, admin, button, msg
        const { BanMembers, KickMembers } = PermissionsBitField.Flags
        if (
            interaction.member.permissions.has([BanMembers, KickMembers]) &&
            !member.bot
        ) {
            kick = new ButtonBuilder()
                .setStyle(4)
                .setCustomId('kick')
                .setLabel('Kick')
            ban = new ButtonBuilder()
                .setStyle(4)
                .setCustomId('ban')
                .setLabel('Ban')
            button = [kick, ban]
            admin = new ActionRowBuilder().addComponents(button)
            msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`User info about ${member.tag}`)
                        .setThumbnail(
                            member.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({ text: `${member.id}` })
                        .addFields([
                            {
                                name: 'Account Creation Date',
                                value: `<t:${Math.round(
                                    member.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: 'Joined Server Date',
                                value: `<t:${Math.round(
                                    memberInGuild.joinedTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                        ]),
                ],
                ephemeral: true,
                components: [admin],
            })
        } else {
            msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(`User info about ${member.tag}`)
                        .setThumbnail(
                            member.displayAvatarURL({ dynamic: true })
                        )
                        .addFields([
                            {
                                name: 'Account Creation Date',
                                value: `<t:${Math.round(
                                    member.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: 'Joined Server Date',
                                value: `<t:${Math.round(
                                    memberInGuild.joinedTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                        ]),
                ],
                ephemeral: true,
            })
        }

        const collector = await msg.createMessageComponentCollector()

        collector.on('collect', async (i) => {
            if (i.customId === 'kick') {
                if (memberInGuild.kickable) {
                    try {
                        await memberInGuild.kick()
                    } catch (error) {}
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: "I can't kick this user",
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: `The user ${memberInGuild} has been kicked`,
                })
            } else if (i.customId === 'ban') {
                if (memberInGuild.bannable) {
                    try {
                        await memberInGuild.ban()
                    } catch (error) {}
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: "I can't ban this user",
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: `The user ${memberInGuild} has been banned`,
                })
            } else {
                await i.reply({
                    ephemeral: true,
                    content: 'Something went wrong!',
                })
            }
        })
    },
}

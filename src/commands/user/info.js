const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setNameLocalizations({
            de: 'info',
        })
        .setDescription('gives info about a user')
        .setDescriptionLocalizations({
            de: 'Gibt Infos über einen Benutzer',
        })
        .addUserOption((option) =>
            option
                .setName('member')
                .setNameLocalizations({
                    de: 'mitglied',
                })
                .setDescription("The user's info you want to get")
                .setDescriptionLocalizations({
                    de: 'Die Infos über den Benutzer den du haben willst',
                })
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        const member = interaction.options.getMember('member')
        let kick, ban, admin, button, msg
        const { BanMembers, KickMembers } = PermissionsBitField.Flags
        if (
            interaction.member.permissions.has([BanMembers, KickMembers]) &&
            !member.user.bot
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
                        .setTitle(`User info about ${member.user.tag}`)
                        .setThumbnail(
                            member.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({ text: `${member.user.id}` })
                        .addFields([
                            {
                                name: 'Account Creation Date',
                                value: `<t:${Math.round(
                                    member.user.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: 'Joined Server Date',
                                value: `<t:${Math.round(
                                    member.joinedTimestamp / 1000
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
                        .setTitle(`User info about ${member.user.tag}`)
                        .setThumbnail(
                            member.user.displayAvatarURL({ dynamic: true })
                        )
                        .addFields([
                            {
                                name: 'Account Creation Date',
                                value: `<t:${Math.round(
                                    member.user.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: 'Joined Server Date',
                                value: `<t:${Math.round(
                                    member.joinedTimestamp / 1000
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
                if (member.kickable) {
                    try {
                        await member.kick()
                    } catch (error) {}
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: "I can't kick this user",
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: `The user ${member} has been kicked`,
                })
            } else if (i.customId === 'ban') {
                if (member.bannable) {
                    try {
                        await member.ban()
                    } catch (error) {}
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: "I can't ban this user",
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: `The user ${member} has been banned`,
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

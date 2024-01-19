const {
    SlashCommandBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    EmbedBuilder,
    PermissionsBitField,
} = require('discord.js')

const langData = require(`../../../resources/translations/lang.json`)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('info')
        .setDescription(langData.en.info.command.description)
        .setDescriptionLocalizations({
            de: langData.de.info.command.description,
        })
        .addUserOption((option) =>
            option
                .setName(langData.en.info.command.userOptionName)
                .setNameLocalizations({
                    de: langData.de.info.command.userOptionName,
                })
                .setDescription(langData.en.info.command.userOptionDescription)
                .setDescriptionLocalizations({
                    de: langData.de.info.command.userOptionDescription,
                })
                .setRequired(true)
        )
        .setDMPermission(false),
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)
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
                .setLabel(langData[userLang].info.buttons.kick)
            ban = new ButtonBuilder()
                .setStyle(4)
                .setCustomId('ban')
                .setLabel(langData[userLang].info.buttons.ban)
            button = [kick, ban]
            admin = new ActionRowBuilder().addComponents(button)
            msg = await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            langData[userLang].info.embed.title +
                            `${member.user.username}`
                        )
                        .setThumbnail(
                            member.user.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({ text: `${member.user.id}` })
                        .addFields([
                            {
                                name: langData[userLang].info.embed.fields
                                    .accountCreated,
                                value: `<t:${Math.round(
                                    member.user.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: langData[userLang].info.embed.fields
                                    .serverJoined,
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
                        .setTitle(
                            langData[userLang].info.embed.title +
                            `${member.user.username}`
                        )
                        .setThumbnail(
                            member.user.displayAvatarURL({ dynamic: true })
                        )
                        .addFields([
                            {
                                name: langData[userLang].info.embed.fields
                                    .accountCreated,
                                value: `<t:${Math.round(
                                    member.user.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: langData[userLang].info.embed.fields
                                    .serverJoined,
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
                    } catch (error) { }
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].errors.notAbleToKickUser,
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: langData[userLang].success.kickSuccess,
                })
            } else if (i.customId === 'ban') {
                if (member.bannable) {
                    try {
                        await member.ban()
                    } catch (error) { }
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].errors.notAbleToBanUser,
                    })
                }
                i.reply({
                    ephemeral: true,
                    content: langData[userLang].success.banSuccess,
                })
            } else {
                await i.reply({
                    ephemeral: true,
                    content: langData[userLang].errors.smthWentWrong,
                })
            }
        })
    },
}

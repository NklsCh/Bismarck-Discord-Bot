const {
    ContextMenuCommandBuilder,
    ApplicationCommandType,
    EmbedBuilder,
    PermissionsBitField,
    ButtonBuilder,
    ActionRowBuilder,
    ContextMenuCommandInteraction
} = require('discord.js')

const langData = require(`../../../resources/translations/lang.json`)

const handleKick = require('../../functions/handleKick')
const handleBan = require('../../functions/handleBan')

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName('Info')
        .setType(ApplicationCommandType.User, ApplicationCommandType.Message, ApplicationCommandType.ChatInput),
    /**
     * Executes the command when invoked by an interaction.
     * @param {ContextMenuCommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const userLang = interaction.locale.slice(0, 2)
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
                            `${member.username}`
                        )
                        .setThumbnail(
                            member.displayAvatarURL({ dynamic: true })
                        )
                        .setFooter({ text: `${member.id}` })
                        .addFields([
                            {
                                name: langData[userLang].info.embed.fields
                                    .accountCreated,
                                value: `<t:${Math.round(
                                    member.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: langData[userLang].info.embed.fields
                                    .serverJoined,
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
                        .setTitle(`User info about ${member.username}`)
                        .setThumbnail(
                            member.displayAvatarURL({ dynamic: true })
                        )
                        .addFields([
                            {
                                name: langData[userLang].info.embed.fields
                                    .accountCreated,
                                value: `<t:${Math.round(
                                    member.createdTimestamp / 1000
                                )}>`,
                                inline: true,
                            },
                            {
                                name: langData[userLang].info.embed.fields
                                    .serverJoined,
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
                if (handleKick(memberInGuild)) {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].success.kickSuccess,
                    })
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].errors.notAbleToKickUser,
                    })
                }
            } else if (i.customId === 'ban') {
                if (handleBan(memberInGuild)) {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].success.banSuccess,
                    })
                } else {
                    await i.reply({
                        ephemeral: true,
                        content: langData[userLang].errors.notAbleToBanUser,
                    })
                }
            } else {
                await i.reply({
                    ephemeral: true,
                    content: langData[userLang].errors.smthWentWrong,
                })
            }
        })
    },
}

const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder } = require('@discordjs/builders');
const { EmbedBuilder, } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("gives info about a user")
    .addUserOption(option => option.setName("member").setDescription("The user's info you want to get").setRequired(true)),
    async execute(interaction) {
        //Todo: Make Buttons functional and only visible to admins
        const member = interaction.options.getMember("member");
        const kick = new ButtonBuilder()
            .setStyle(4)
            .setCustomId("kick")
            .setLabel("Kick")
        const ban = new ButtonBuilder()
            .setStyle(4)
            .setCustomId("ban")
            .setLabel("Ban")
        const mute = new ButtonBuilder()
            .setStyle(4)
            .setCustomId("mute")
            .setLabel("Mute")
        const Button = [kick, ban, mute]
            interaction.reply({embeds: [
                new EmbedBuilder()
                .setTitle(`Member Info about ${member.user.tag}`)
                .setThumbnail(member.user.displayAvatarURL({dynamic: true}))
                .addFields([
                    {
                        name: "Account Creation Date",
                        value: `<t:${Math.round(member.user.createdTimestamp / 1000)}>`,
                        inline: true
                    },
                    {
                        name: "Joined Server Date",
                        value: `<t:${Math.round(member.joinedTimestamp / 1000)}>`,
                        inline: true
                    }
                ])
            ], 
            ephemeral: true,
            components: [
                new ActionRowBuilder()
                .addComponents(Button)
            ]
        })
    }
}

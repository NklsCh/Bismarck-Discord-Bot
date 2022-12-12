const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('@discordjs/builders');
const { EmbedBuilder} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("gives info about a user")
    .addUserOption(option => option.setName("member").setDescription("The user's info you want to get").setRequired(true)),
    async execute(interaction) {
        const member = interaction.options.getMember("member");
        /* const Button = new ButtonBuilder()
            .setStyle(1)
            .setCustomId("invite")
            .setLabel("Invite") */
        interaction.reply(/* {components: [new ActionRowBuilder().addComponents(Button)]}, */{embeds: [
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
        ]});
    }
}

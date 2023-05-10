const {
    SlashCommandBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
} = require('discord.js')
module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Create a poll')
        .setDescriptionLocalizations({
            de: 'Erstelle eine Umfrage',
        })
        .addStringOption((option) =>
            option
                .setName('question')
                .setDescription('The question of the poll')
                .setDescriptionLocalizations({
                    de: 'Die Frage der Umfrage',
                })
                .setRequired(true)
        )
        .addStringOption((option1) =>
            option1
                .setName('option1')
                .setDescription('The options of the poll')
                .setDescriptionLocalizations({
                    de: 'Die Optionen der Umfrage',
                })
                .setRequired(true)
        )
        .addStringOption((option2) =>
            option2
                .setName('option2')
                .setDescription('The options of the poll')
                .setDescriptionLocalizations({
                    de: 'Die Optionen der Umfrage',
                })
                .setRequired(true)
        )
        .addStringOption((option3) =>
            option3
                .setName('option3')
                .setDescription('The options of the poll')
                .setDescriptionLocalizations({
                    de: 'Die Optionen der Umfrage',
                })
        )
        .addStringOption((option4) =>
            option4
                .setName('option4')
                .setDescription('The options of the poll')
                .setDescriptionLocalizations({
                    de: 'Die Optionen der Umfrage',
                })
        ),
    async execute(interaction) {
        const options = [
            (buttonOpt1 = new ButtonBuilder().setStyle(1).setLabel('1').setCustomId('pollOpt1')),
            (buttonOpt2 = new ButtonBuilder().setStyle(1).setLabel('2').setCustomId('pollOpt2')),
            (buttonOpt3 = new ButtonBuilder().setStyle(1).setLabel('3').setCustomId('pollOpt3')),
            (buttonOpt4 = new ButtonBuilder().setStyle(1).setLabel('4').setCustomId('pollOpt4')),
        ]
        const row1 = new ActionRowBuilder().addComponents(options)

        const question = interaction.options.getString('question')
        const option1 = interaction.options.getString('option1')
        const option2 = interaction.options.getString('option2')
        const option3 = interaction.options.getString('option3')
        const option4 = interaction.options.getString('option4')

        const poll = new EmbedBuilder()
            .setTitle(question)
            .setFooter({ text: `Poll by ${interaction.user.tag}` })
            .setFields([
                {
                    name: '1',
                    value: option1,
                    inline: true,
                },
                {
                    name: '2',
                    value: option2,
                    inline: true,
                },
                {
                    name: ' ',
                    value: ' ',
                    inline: true,
                },
                {
                    name: '3',
                    value: option3,
                    inline: true,
                },
                {
                    name: '4',
                    value: option4,
                    inline: true,
                },
                {
                    name: ' ',
                    value: ' ',
                    inline: true,
                }
            ])

        interaction.reply({
            embeds: [poll],
            components: [row1],
        })
    },
}

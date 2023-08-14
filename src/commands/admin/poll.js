const {
    SlashCommandBuilder,
    ButtonBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    AttachmentBuilder,
} = require('discord.js')
const { ChartJSNodeCanvas } = require('chartjs-node-canvas')

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
        const question = interaction.options.getString('question')
        const option1 = interaction.options.getString('option1')
        const option2 = interaction.options.getString('option2')
        const option3 = interaction.options.getString('option3')
        const option4 = interaction.options.getString('option4')

        const poll = new EmbedBuilder()
            .setFooter({ text: '🤚 Poll System' })
            .setTimestamp()
            .setTitle(question)
            .addFields({
                name: '1️⃣: ' + option1,
                value: '> **0 Votes**',
                inline: true,
            })
            .addFields({
                name: '2️⃣: ' + option2,
                value: '> **0 Votes**',
                inline: true,
            })
            .addFields({ name: ' ', value: ' ' })
            .addFields({
                name: option3 ? '3️⃣: ' + option3 : ' ',
                value: option3 ? '> **0 Votes**' : ' ',
                inline: true,
            })
            .addFields({
                name: option4 ? '4️⃣: ' + option4 : ' ',
                value: option4 ? '> **0 Votes**' : ' ',
                inline: true,
            })
            .addFields({
                name: 'Author',
                value: `> ${interaction.user}`,
                inline: false,
            })

        const buttons = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('option1')
                .setEmoji('1️⃣')
                .setStyle(2),
            new ButtonBuilder()
                .setCustomId('option2')
                .setEmoji('2️⃣')
                .setStyle(2)
        )
        const button3 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('option3')
                .setEmoji('3️⃣')
                .setStyle(2)
        )
        const button4 = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId('option4')
                .setEmoji('4️⃣')
                .setStyle(2)
        )

        const msg = await interaction.reply({
            embeds: [poll],
            components: [buttons],
        })
        option3 ? msg.edit({ components: [buttons, button3] }) : null
        option4 ? msg.edit({ components: [buttons, button3, button4] }) : null

        setTimeout(async () => {
            let message = await msg.fetch()
            const generatedChart = async (labels, datas) => {
                const renderer = new ChartJSNodeCanvas({
                    width: 500,
                    height: 500,
                })
                const image = await renderer.renderToBuffer({
                    type: 'pie',
                    data: {
                        labels: labels,
                        datasets: [
                            {
                                label: 'Poll',
                                data: datas,
                                backgroundColor: [
                                    '#57F287',
                                    '#FEE75C',
                                    '#5865F2',
                                    '#ED4245',
                                ],
                            },
                        ],
                    },
                })
                return new AttachmentBuilder(image)
            }
            let labels = ['1', '2', '3', '4']
            let datas = [
                message.embeds[0].fields[0].value
                    .split('**')
                    .join(' ')
                    .split(' ')[2],
                message.embeds[0].fields[1].value
                    .split('**')
                    .join(' ')
                    .split(' ')[2],
                message.embeds[0].fields[3].value
                    .split('**')
                    .join(' ')
                    .split(' ')[2],
                message.embeds[0].fields[4].value
                    .split('**')
                    .join(' ')
                    .split(' ')[2],
            ]

            const finalVote = new EmbedBuilder()
                .setTitle('Poll Results')
                .setFooter({ text: '🤚 Poll System' })
                .setTimestamp()
                .setImage('attachment://chart.png')

            const attachment = await generatedChart(labels, datas)

            await interaction.channel.send({
                embeds: [finalVote],
                files: [attachment],
            })

            msg.edit({ components: [] })
        }, 60000)
    },
}

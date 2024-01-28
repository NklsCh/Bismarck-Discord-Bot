const { Events, CommandInteraction } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    /**
     * Executes the interaction command or button.
     * @param {CommandInteraction} interaction - The interaction object.
     * @returns {Promise<void>} - A promise that resolves when the execution is complete.
     */
    async execute(interaction) {
        if (!interaction.isCommand() && !interaction.isButton()) return

        const command = interaction.client.commands.get(interaction.commandName)

        if (command) {
            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({
                    content: 'There was an error while executing this command!',
                    ephemeral: true,
                })
            }
        }
    },
}

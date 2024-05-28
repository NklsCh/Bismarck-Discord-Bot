const { Events, BaseInteraction } = require('discord.js')

module.exports = {
    name: Events.InteractionCreate,
    /**
     * Executes the interaction command or button.
     * @param {BaseInteraction} interaction - The interaction object.
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

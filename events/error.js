const { Events } = require("discord.js");

module.exports = {
    name: Events.Error,
    /**
     * Executes the error event handler.
     * @param {Error} err - The error object.
     */
    execute(err) {
        console.error(err);
    },
};

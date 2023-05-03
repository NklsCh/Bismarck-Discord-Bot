const { Events } = require("discord.js");

module.exports = {
    name: Events.Error,
    execute(Client) {
        console.error(Client);
    },
};

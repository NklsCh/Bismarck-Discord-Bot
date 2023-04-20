const { Events } = require("discord.js");

module.exports = {
    name: Events.Error,
    execute(Client) {
        console.log(Error);
        throw new Error("Error event triggered!");
    },
};

const {Events} = require('discord.js');

module.exports = {
    name: Events.Error,
    execute(client) {
        throw new Error('Error event triggered!');
    },
};
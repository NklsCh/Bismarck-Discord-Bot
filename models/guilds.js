const Sequialize = require("sequelize");
const sequelize = require('../utils/database.js');

const Guilds = sequelize.define('guilds', {
    guildId: {
        type: Sequialize.STRING,
        primaryKey: true,
    },
    onlineChannelId: {
        type: Sequialize.STRING,
        allowNull: true,
    },
    allChannelId: {
        type: Sequialize.STRING,
        allowNull: true,
    },
    botChannelId: {
        type: Sequialize.STRING,
        allowNull: true,
    },
    welcomeChannelId: {
        type: Sequialize.STRING,
        allowNull: true,
    },
    goodbyeChannelId: {
        type: Sequialize.STRING,
        allowNull: true,
    },
});

module.exports = Guilds;
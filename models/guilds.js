const Sequelize = require('sequelize')
const sequelize = require('../utils/database.js')

const Guilds = sequelize.define('guilds', {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    onlineChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    allChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    botChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    welcomeChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    goodbyeChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    join2CreateChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    logChannelId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    joinRoleId: {
        type: Sequelize.STRING,
        allowNull: true,
    },
})

module.exports = Guilds

const Sequelize = require('sequelize')
const sequelize = require('../utils/database.js')

const CMessage = sequelize.define('cMessage', {
    guildId: {
        type: Sequelize.STRING,
        primaryKey: true,
    },
    welcomeMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
    goodbyeMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
    },
})

module.exports = CMessage

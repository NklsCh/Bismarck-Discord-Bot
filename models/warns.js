const Sequelize = require( "sequelize" );
const sequelize = require( "../utils/database.js" );

const warns = sequelize.define( "warns", {
    guildId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userId: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    reason: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
} );

module.exports = warns;

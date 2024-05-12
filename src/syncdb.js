const Guilds = require('../models/guilds')
const cMessage = require('../models/cMessage')
const warns = require('../models/warns')

//Associations
Guilds.hasOne(cMessage, { foreignKey: 'guildId' })
cMessage.belongsTo(Guilds, { foreignKey: 'guildId' })

Guilds.hasMany(warns, { foreignKey: 'guildId' })
warns.belongsTo(Guilds, { foreignKey: 'guildId' })


//Force: Resets the database
/* Guilds.sync({ force: true }).then(() => {
    console.log('Database reset!')
})
cMessage.sync({ force: true }).then(() => {
    console.log('Database reset!')
})
warns.sync({ force: true }).then(() => {
    console.log('Database reset!')
}) */

//Alter: Updates the database
Guilds.sync({ alter: true }).then(() => {
    console.log('Database updated!');
});
cMessage.sync({ alter: true }).then(() => {
    console.log("Database updated!");
});
warns.sync({ alter: true }).then(() => {
    console.log("Database updated!");
});


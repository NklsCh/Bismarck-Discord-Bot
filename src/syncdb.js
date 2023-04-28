const Guilds = require('../models/guilds');


//Force: Resets the database
Guilds.sync({ force: true }).then(() => {
    console.log('Database reset!');
});

//Alter: Updates the database
/* sequelize.sync({ alter: true }).then(() => {
    console.log('Database updated!');
}); */
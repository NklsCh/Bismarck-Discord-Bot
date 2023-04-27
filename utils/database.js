const Sequialize = require("sequelize");
const sequelize = new Sequialize("database", "user", "password", {
    dialect: "sqlite",
    host: "localhost",
    storage: "database.sqlite",
    logging: false,
});

module.exports = sequelize;
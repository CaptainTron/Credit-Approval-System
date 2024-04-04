const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config()
// Connect to PostgreSQL database
const sequelize = new Sequelize('mydatabase', 'myuser', 'mypassword', {
    host: 'postgres',
    dialect: 'postgres',
    port: 5432,
    logging: false
});
// Test the connection
(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to POSTGRES has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.message);
    }
})();

const db = {};
db.Sequelize = Sequelize; 
db.sequelize = sequelize;

db.Customer = require("../models/customer_info.js")(sequelize, DataTypes); 
db.Customer_loans = require("../models/Customer_loan.js")(sequelize, DataTypes);
 
db.register = require("../models/register.js")(sequelize, DataTypes);
db.loans = require("../models/loans.js")(sequelize, DataTypes);

db.sequelize.sync({ force: false })
    .then(() => console.log("Re-Sync Successful"))

module.exports = db;

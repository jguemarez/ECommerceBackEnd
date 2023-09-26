//Requiring the DotEnv package and its method to store configuration in the environment
require('dotenv').config();
//Importing the Sequelize class in order to create a new connection to the MySQL ecommerce_db through which we will synchronize the models
const Sequelize = require('sequelize');

const sequelize = process.env.JAWSDB_URL
  ? new Sequelize(process.env.JAWSDB_URL)
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
      host: 'localhost',
      dialect: 'mysql',
      dialectOptions: {
        decimalNumbers: true,
      },
    });

//Exporting the Sequelize connection with the given configuration
module.exports = sequelize;

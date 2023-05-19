require('dotenv').config();
const Sequelize = require('sequelize');

const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_DIALECT, DB_HOST } = process.env;
const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST || 'localhost',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
});

const initialize = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  initialize,
  sequelize,
};

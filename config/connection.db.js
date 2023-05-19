require('dotenv').config();
const Sequelize = require('sequelize');

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT = 'postgres',
  DB_HOST = 'localhost',
  DB_PORT,
} = process.env;
const sequelize = new Sequelize({
  dialect: DB_DIALECT,
  host: DB_HOST,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  port: DB_PORT,
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

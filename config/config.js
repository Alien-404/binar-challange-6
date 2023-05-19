require('dotenv').config();

const {
  DB_USERNAME,
  DB_PASSWORD,
  DB_NAME,
  DB_DIALECT = 'postgres',
  DB_PORT,
  DB_HOST,
} = process.env;

module.exports = {
  development: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST || 'localhost',
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: false,
  },
  test: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST || 'localhost',
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: false,
  },
  production: {
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST || 'localhost',
    dialect: DB_DIALECT,
    port: DB_PORT,
    logging: false,
  },
};

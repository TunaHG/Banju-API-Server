require('dotenv').config();

module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "forte",
    "host": "forte-test.cethaknrgb68.ap-northeast-2.rds.amazonaws.com",
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "test",
    "host": "forte-test.cethaknrgb68.ap-northeast-2.rds.amazonaws.com",
    "dialect": "postgres",
    "logging": false
  },
  "production": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASSWORD,
    "database": "forte",
    "host": "forte-test.cethaknrgb68.ap-northeast-2.rds.amazonaws.com",
    "dialect": "postgres",
    "logging": false
  }
}

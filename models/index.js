const config = require('../config/config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = require('./Users')(sequelize, Sequelize);
db.Banjus = require('./Banjus')(sequelize, Sequelize);
db.Practices = require('./Practices')(sequelize, Sequelize);

// db.Users.hasMany()

module.exports = db;
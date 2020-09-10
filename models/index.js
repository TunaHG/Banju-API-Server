'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Practices = require('./Practices');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'test';
const config = require(__dirname + '/../config/database.js')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Users.hasMany(db.Banjus, { foreignKey: 'user_id', sourceKey: 'id' });
db.Banjus.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'id' });
db.Users.hasMany(db.Practices, { foreignKey: 'user_id', sourceKey: 'id' });
db.Practices.belongsTo(db.Users, { foreignKey: 'user_id', targetKey: 'id' });
db.Banjus.hasMany(db.Practices, { foreignKey: 'banju_id', sourceKey: 'id' });
db.Practices.belongsTo(db.Banjus, { foreignKey: 'banju_id', targetKey: 'id' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

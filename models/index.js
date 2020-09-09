const config = require('../config/config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Users = require('./Users')(sequelize, Sequelize);
db.Banjus = require('./Banjus')(sequelize, Sequelize);
db.Practices = require('./Practices')(sequelize, Sequelize);
db.Posts = require('./Posts')(sequelize, Sequelize);
db.Comments = require('./Comments')(sequelize, Sequelize);
db.Follows = require('./Follows')(sequelize, Sequelize);

// Database Associations
db.Users.hasMany(db.Banjus);
db.Banjus.belongsTo(db.Users);
db.Users.hasMany(db.Practices);
db.Practices.belongsTo(db.Users);
db.Banjus.hasMany(db.Practices);
db.Practices.belongsTo(db.Banjus);
db.Users.hasMany(db.Posts);
db.Posts.belongsTo(db.Users);
db.Posts.hasMany(db.Comments);
db.Comments.belongsTo(db.Posts);
db.Users.hasMany(db.Comments);
db.Comments.belongsTo(db.Users);

module.exports = db;
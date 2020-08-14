// load config file
const config = require('../config/config');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);

// Set model Users
const Users = sequelize.define('Users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // social login, your login id
    email: Sequelize.STRING,
    // login password
    password: Sequelize.STRING,
    // display name to other users
    nickname: Sequelize.STRING,
    // if you want display your phone number
    phone: Sequelize.STRING,
    // last login
    last_access_at: Sequelize.DATE
}, {
    // Table name does not change
    freezeTableName: true,
    // createdAt, updatedAt create!
    timestamps: true,
    // updatedAt does not created
    updatedAt: false
});

// export
exports.Users = Users;
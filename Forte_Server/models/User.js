const config = require('../config/config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);

const User = sequelize.define('User', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true
    },
    email: Sequelize.STRING,
    password: Sequelize.STRING,
    nickname: Sequelize.STRING,
    phone: Sequelize.STRING,
    create_at: Sequelize.DATE,
    last_access_at: Sequelize.DATE
}, {
    freezeTableName: true,
    timestamps: false
});

exports.User = User;
const config = require('../config/config');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);

const Converted_Links = sequelize.define('Converted_Links', {
    link: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    result: Sequelize.JSON
}, {
    freezeTableName: true,
    timestamps: false
});

exports.Converted_Links = Converted_Links;
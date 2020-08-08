const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

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
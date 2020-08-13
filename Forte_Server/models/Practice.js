const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

const { User } = require('./User');
const { Banju } = require('./Banju');

const Practice = sequelize.define('Practice', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true
    },
    user_id: {
        type: Sequelize.NUMBER,
        references: {
            model: User,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    banju_id: {
        type: Sequelize.NUMBER,
        references: {
            model: Banju,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    user_banju: Sequelize.JSON,
    hard_chord: Sequelize.STRING,
    hard_chord_progression: Sequelize.STRING,
    accuracy: Sequelize.NUMBER,
    created_at: Sequelize.DATE
}, {
    freezeTableName: true,
    timestamps: false
});

exports.Practice = Practice;
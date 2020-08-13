const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/.env') });

const User = require('./User');

const Sequelize = require('sequelize');
const sequelize = new Sequelize(process.env.DEV_DATABASE_URL);

const Banju = sequelize.define('Banju', {
    id: Sequelize.NUMBER,
    is_youtube: Sequelize.BOOLEAN,
    link: {
        type: Sequelize.STRING,
    },
    content: Sequelize.JSON,
    user_id: {
        type: Sequelize.NUMBER,
        references: {
            model: User,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    parent_banju_id: Sequelize.NUMBER,
    original_banju_id: Sequelize.NUMBER,
    included_chord: Sequelize.STRING,
    hard_chord: Sequelize.STRING,
    hard_chord_progression: Sequelize.STRING,
    practice_start_cnt: Sequelize.NUMBER,
    practice_end_cnt: Sequelize.NUMBER
}, {
    freezeTableName: true,
    timestamps: false
});

exports.Banju = Banju;
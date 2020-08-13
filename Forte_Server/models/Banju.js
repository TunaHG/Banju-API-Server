// load Config File
const config = require('../config/config');

// load User model for foreign key
const Users = require('./Users');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);

// Set Model Banju
const Banjus = sequelize.define('Banjus', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true
    },
    // youtube link(true) or wav file(false)
    is_youtube: Sequelize.BOOLEAN,
    // is_youtube is true >> link isn't null
    // is_youtube is false >> link is null
    link: {
        type: Sequelize.STRING//,
        // unique key? 
        //unique: true
    },
    // Converted Data from AI Model
    content: Sequelize.JSON,
    // Who Create this Banju?
    user_id: {
        type: Sequelize.NUMBER,
        references: {
            model: Users,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    // this id derived from parent id
    parent_banju_id: Sequelize.NUMBER,
    // this banju's original id (AI model's )
    original_banju_id: Sequelize.NUMBER,
    included_chord: Sequelize.STRING,
    // Often Wrong Chord
    hard_chord: Sequelize.STRING,
    // Often Wrong Chord Progression
    hard_chord_progression: Sequelize.STRING,
    // Practice 
    practice_start_cnt: Sequelize.NUMBER,
    practice_end_cnt: Sequelize.NUMBER
}, {
    // Table name does not change
    freezeTableName: true,
    // createdAt, updatedAt create!
    timestamps: true,
    // updatedAt does not created
    updatedAt: false
});

// export
exports.Banjus = Banjus;
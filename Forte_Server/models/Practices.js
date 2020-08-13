// load config file
const config = require('../config/config');

// Sequelize Setting
const Sequelize = require('sequelize');
const sequelize = new Sequelize(config.databaseurl);

// load other model for foreign key
const { Users } = require('./Users');
const { Banjus } = require('./Banjus');

// Set model practice
const Practices = sequelize.define('Practices', {
    id: {
        type: Sequelize.NUMBER,
        primaryKey: true
    },
    // Who create this practice data
    user_id: {
        type: Sequelize.NUMBER,
        // foreign key setting
        references: {
            model: Users,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    // What banju do you practice
    banju_id: {
        type: Sequelize.NUMBER,
        // foreign key setting
        references: {
            model: Banjus,
            key: 'id',
            deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
        }
    },
    // practice data (Similar AI Model's Converted Data)
    user_banju: Sequelize.JSON,
    // Feedback: Often wrong chord
    hard_chord: Sequelize.STRING,
    // Feedback: Often wrong chord progression
    hard_chord_progression: Sequelize.STRING,
    // Feedback: Practice Accuracy Compared to the original Banju
    accuracy: Sequelize.NUMBER,
}, {
    // Table name does not change
    freezeTableName: true,
    // createdAt, updatedAt create!
    timestamps: true,
    // updatedAt does not created
    updatedAt: false
});

// export
exports.Practices = Practices;
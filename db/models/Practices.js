module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Practices', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        // practice data (Similar AI Model's Converted Data)
        user_banju: Sequelize.JSONB,
        // Feedback: Often wrong chord
        hard_chord: Sequelize.STRING,
        // Feedback: Often wrong chord progression
        hard_chord_progression: Sequelize.STRING,
        // Feedback: Practice Accuracy Compared to the original Banju
        accuracy: Sequelize.INTEGER,
    }, {
        // Table name does not change
        freezeTableName: true,
        // createdAt, updatedAt create!
        timestamps: true,
        // updatedAt does not created
        updatedAt: false,
        // apply snake case on foreign key
        underscored: true
    });
};
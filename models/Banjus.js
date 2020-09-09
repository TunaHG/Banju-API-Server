module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Banjus', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        // youtube link(true) or wav file(false)
        is_youtube: {
            type: Sequelize.BOOLEAN,
            defaultValue: true
        },
        // is_youtube is true >> link isn't null
        // is_youtube is false >> link is null
        link: {
            type: Sequelize.STRING,
            defaultValue: null,
            // unique key? 
            unique: true
        },
        // Converted Data from AI Model
        content: Sequelize.JSON,
        // Who Create this Banju?
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        // this id derived from parent id
        parent_banju_id: Sequelize.INTEGER,
        // this banju's original id (AI model's )
        original_banju_id: Sequelize.INTEGER,
        included_chord: Sequelize.STRING,
        // Often Wrong Chord
        hard_chord: Sequelize.STRING,
        // Often Wrong Chord Progression
        hard_chord_progression: Sequelize.STRING,
        // Practice 
        practice_start_cnt: Sequelize.INTEGER,
        practice_end_cnt: Sequelize.INTEGER
    }, {
        // Table name does not change
        freezeTableName: true,
        // createdAt, updatedAt create!
        timestamps: true,
        // updatedAt does not created
        updatedAt: false
    });
};
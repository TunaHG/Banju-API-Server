module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Banjus', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: {
                model: 'Users',
                key: 'id',
                deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE
            }
        },
        type: Sequelize.STRING,
        type_id: Sequelize.INTEGER,
        content: Sequelize.STRING,
    }, {
        // Table name does not change
        freezeTableName: true,
        // createdAt, updatedAt create!
        timestamps: true,
        // updatedAt does not created
        updatedAt: false
    });
};
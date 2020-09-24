module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Posts', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
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
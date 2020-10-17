module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Comments', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
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
// export
module.exports = (sequelize, Sequelize) => {
    // Set model Users
    return sequelize.define('Users', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        // social login, your login id
        email: Sequelize.STRING,
        // login password
        password: Sequelize.STRING,
        // display name to other users
        nickname: Sequelize.STRING,
        // if you want display your phone number
        phone: Sequelize.STRING,
        // last login
        last_access_at: Sequelize.DATE
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
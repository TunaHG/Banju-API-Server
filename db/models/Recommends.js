module.exports = (sequelize, Sequelize) => {
    return sequelize.define('Recommends', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV1,
            primaryKey: true
        },
        video_id: {
            type: Sequelize.STRING,
            unique: true
        },
        scale: Sequelize.STRING,
        title: Sequelize.STRING,
        thumbnails: Sequelize.JSONB
    });
}
const models = require('../db/models');

exports.findBanju = async (link) => {
    const count = await models.Banjus.count({
        where: {
            link: link
        }
    });

    if (count === 0) {
        return 0;
    }

    const find = await models.Banjus.findOne({
        attributes: ['content'],
        where: {
            is_youtube: true,
            link: link
        }
    });

    content = find.content;
    console.log("SQL Select query Success");
    return content;
}
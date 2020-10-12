const model = require('../db/models');

exports.findBanju = async (link) => {
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
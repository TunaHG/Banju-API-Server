const models = require('../db/models');

// * after midterm, change to function using id

// DB: Select function using link
exports.findBanju = async (link) => {
    const count = await models.Banjus.count({
        where: {
            link: link
        }
    });

    if (count === 0) {
        console.log("Not found row about videoId");
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
};

// DB: Update function using link, content (youtube)
exports.update = async (link, content) => {
    const update = await models.Banjus.update({ content: content }, {
        where: {
            is_youtube: true,
            link: link
        }
    });
    console.log("SQL Update query Success");
    return update;
};
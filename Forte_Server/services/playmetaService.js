const models = require('../models');

// * after midterm, change to function using id

// DB: Select function using link
exports.find = async (link) => {
    const find = await models.Banjus.findOne({
        attributes: ['content'],
        where: {
            is_youtube: true,
            link: link
        }
    });
    content = JSON.parse(find.content);
    console.log("Check Data: ", content);
    return content;
};

// DB: Update function using link, content (youtube)
exports.update = async (link, content) => {
    await models.Banjus.update({ content: content }, {
        where: {
            is_youtube: true, 
            link: link 
        }
    });
    console.log("Update Data: ", content);
};
const { Banjus } = require('../models/Banjus');

// * after midterm, change to function using id

// DB: Select function using link
exports.find = async (link) => {
    const find = await Banjus.findAll({
        attributes: ['content'],
        where: {
            is_youtube: true,
            link: link
        }
    });
    result = JSON.stringify(find, null, 2);
    console.log("Check Data: ", result);
    return result;
};

// DB: Update function using link, content (youtube)
exports.update = async (link, content) => {
    await Banju.update({ content: content }, {
        where: {
            is_youtube: true, 
            link: link 
        }
    });
    console.log("Update Data: ", result)
};